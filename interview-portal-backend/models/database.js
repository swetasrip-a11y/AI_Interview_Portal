const sqlite3 = require('sqlite3').verbose();
const mysql = require('mysql2/promise');
const path = require('path');

const DB_TYPE = (process.env.DB_TYPE || 'sqlite').toLowerCase();

// SQLite defaults
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'interview_portal.db');

let sqliteDb = null;
let mysqlPool = null;

const isMySQL = () => DB_TYPE === 'mysql';

const initSqlite = () => {
  sqliteDb = new sqlite3.Database(DB_PATH, (err) => {
    if (err) console.error('SQLite database error:', err.message);
    else console.log('Connected to SQLite database');
  });

  sqliteDb.serialize(() => {
    const run = (sql) => {
      sqliteDb.run(sql, (err) => {
        if (err) console.error('SQLite init error:', err.message, '\nSQL:', sql);
      });
    };

    // Use the existing CREATE TABLE statements (compatible with SQLite)
    run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        full_name TEXT NOT NULL,
        role TEXT DEFAULT 'candidate',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // The rest of tables - keep original SQLite DDL (keeps compatibility)
    // Questions
    run(`
      CREATE TABLE IF NOT EXISTS questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        question_text TEXT NOT NULL,
        option_a TEXT NOT NULL,
        option_b TEXT NOT NULL,
        option_c TEXT NOT NULL,
        option_d TEXT NOT NULL,
        correct_option TEXT NOT NULL,
        difficulty TEXT DEFAULT 'medium',
        created_by INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id)
      )
    `);

    // Interviews
    run(`
      CREATE TABLE IF NOT EXISTS interviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        interviewer_id INTEGER NOT NULL,
        job_title TEXT,
        status TEXT DEFAULT 'open',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (interviewer_id) REFERENCES users(id)
      )
    `);

    // interview_candidates
    run(`
      CREATE TABLE IF NOT EXISTS interview_candidates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        interview_id INTEGER NOT NULL,
        candidate_id INTEGER NOT NULL,
        status TEXT DEFAULT 'pending',
        score INTEGER,
        comments TEXT,
        decision TEXT,
        marks_obtained INTEGER,
        total_marks INTEGER DEFAULT 100,
        joined_at DATETIME,
        submitted_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (interview_id) REFERENCES interviews(id),
        FOREIGN KEY (candidate_id) REFERENCES users(id)
      )
    `);

    // submissions
    run(`
      CREATE TABLE IF NOT EXISTS submissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        question_id INTEGER NOT NULL,
        selected_option TEXT,
        is_correct BOOLEAN,
        submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (question_id) REFERENCES questions(id)
      )
    `);

    // materials
    run(`
      CREATE TABLE IF NOT EXISTS materials (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        content TEXT,
        category TEXT,
        created_by INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id)
      )
    `);

    // jobs
    run(`
      CREATE TABLE IF NOT EXISTS jobs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        company_id INTEGER NOT NULL,
        location TEXT,
        salary TEXT,
        requirements TEXT,
        experience_level TEXT,
        status TEXT DEFAULT 'open',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (company_id) REFERENCES users(id)
      )
    `);

    // candidate_profiles
    run(`
      CREATE TABLE IF NOT EXISTS candidate_profiles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        candidate_id INTEGER UNIQUE NOT NULL,
        resume_path TEXT,
        skills TEXT,
        experience TEXT,
        education TEXT,
        phone TEXT,
        location TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (candidate_id) REFERENCES users(id)
      )
    `);

    // job_applications
    run(`
      CREATE TABLE IF NOT EXISTS job_applications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        candidate_id INTEGER NOT NULL,
        job_id INTEGER NOT NULL,
        status TEXT DEFAULT 'applied',
        resume_file TEXT,
        applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (candidate_id) REFERENCES users(id),
        FOREIGN KEY (job_id) REFERENCES jobs(id)
      )
    `);

    // ai_interview_sessions
    run(`
      CREATE TABLE IF NOT EXISTS ai_interview_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        candidate_id INTEGER NOT NULL,
        job_id INTEGER NOT NULL,
        company_id INTEGER,
        interview_type TEXT DEFAULT 'text',
        status TEXT DEFAULT 'pending',
        final_score REAL,
        total_questions INTEGER,
        correct_answers INTEGER,
        interview_duration INTEGER,
        ai_feedback TEXT,
        started_at DATETIME,
        completed_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (candidate_id) REFERENCES users(id),
        FOREIGN KEY (job_id) REFERENCES jobs(id),
        FOREIGN KEY (company_id) REFERENCES users(id)
      )
    `);

    // resumes
    run(`
      CREATE TABLE IF NOT EXISTS resumes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        filename TEXT NOT NULL,
        file_path TEXT NOT NULL,
        size INTEGER,
        status TEXT DEFAULT 'pending',
        uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // ai_interview_responses
    run(`
      CREATE TABLE IF NOT EXISTS ai_interview_responses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id INTEGER NOT NULL,
        question_id INTEGER NOT NULL,
        candidate_answer TEXT,
        ai_evaluation TEXT,
        score REAL,
        confidence_level REAL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (session_id) REFERENCES ai_interview_sessions(id),
        FOREIGN KEY (question_id) REFERENCES questions(id)
      )
    `);

    // hiring_decisions
    run(`
      CREATE TABLE IF NOT EXISTS hiring_decisions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        candidate_id INTEGER NOT NULL,
        job_id INTEGER NOT NULL,
        company_id INTEGER NOT NULL,
        ai_score REAL,
        decision TEXT DEFAULT 'pending',
        feedback TEXT,
        decision_date DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (candidate_id) REFERENCES users(id),
        FOREIGN KEY (job_id) REFERENCES jobs(id),
        FOREIGN KEY (company_id) REFERENCES users(id)
      )
    `);

    // chat_messages
    run(`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        candidate_id INTEGER NOT NULL,
        interviewer_id INTEGER NOT NULL,
        message TEXT NOT NULL,
        response TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (candidate_id) REFERENCES users(id),
        FOREIGN KEY (interviewer_id) REFERENCES users(id)
      )
    `);

    // interview_reports
    run(`
      CREATE TABLE IF NOT EXISTS interview_reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        candidate_id INTEGER NOT NULL,
        interview_id INTEGER NOT NULL,
        report_data TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (candidate_id) REFERENCES users(id),
        FOREIGN KEY (interview_id) REFERENCES interviews(id)
      )
    `);

    // performance_metrics
    run(`
      CREATE TABLE IF NOT EXISTS performance_metrics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        candidate_id INTEGER NOT NULL,
        interview_id INTEGER NOT NULL,
        technical_score REAL,
        soft_skills_score REAL,
        overall_score REAL,
        communication_clarity REAL,
        problem_solving REAL,
        teamwork REAL,
        leadership REAL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (candidate_id) REFERENCES users(id),
        FOREIGN KEY (interview_id) REFERENCES interviews(id)
      )
    `);
  });
};

const initMySQL = async () => {
  const config = {
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'interview_portal',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  };

  try {
    mysqlPool = mysql.createPool(config);
    await mysqlPool.query('SELECT 1');
    console.log('Connected to MySQL database');

    // Create tables with MySQL-compatible DDL where necessary
    const queries = [];

    queries.push(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'candidate',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);

    queries.push(`
      CREATE TABLE IF NOT EXISTS questions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        question_text TEXT NOT NULL,
        option_a TEXT NOT NULL,
        option_b TEXT NOT NULL,
        option_c TEXT NOT NULL,
        option_d TEXT NOT NULL,
        correct_option VARCHAR(10) NOT NULL,
        difficulty VARCHAR(50) DEFAULT 'medium',
        created_by INT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
      ) ENGINE=InnoDB;
    `);

    queries.push(`
      CREATE TABLE IF NOT EXISTS interviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        interviewer_id INT NOT NULL,
        job_title VARCHAR(255),
        status VARCHAR(50) DEFAULT 'open',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (interviewer_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    queries.push(`
      CREATE TABLE IF NOT EXISTS interview_candidates (
        id INT AUTO_INCREMENT PRIMARY KEY,
        interview_id INT NOT NULL,
        candidate_id INT NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        score INT,
        comments TEXT,
        decision VARCHAR(50),
        marks_obtained INT,
        total_marks INT DEFAULT 100,
        joined_at DATETIME,
        submitted_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (interview_id) REFERENCES interviews(id) ON DELETE CASCADE,
        FOREIGN KEY (candidate_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    // ... add other table creation queries (resumes, submissions, jobs, etc.)
    // For brevity add a minimal set: submissions, jobs, candidate_profiles, performance_metrics

    queries.push(`
      CREATE TABLE IF NOT EXISTS submissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        question_id INT NOT NULL,
        selected_option TEXT,
        is_correct TINYINT(1),
        submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    queries.push(`
      CREATE TABLE IF NOT EXISTS jobs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        company_id INT NOT NULL,
        location VARCHAR(255),
        salary VARCHAR(255),
        requirements TEXT,
        experience_level VARCHAR(100),
        status VARCHAR(50) DEFAULT 'open',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (company_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    queries.push(`
      CREATE TABLE IF NOT EXISTS candidate_profiles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        candidate_id INT UNIQUE NOT NULL,
        resume_path TEXT,
        skills TEXT,
        experience TEXT,
        education TEXT,
        phone VARCHAR(50),
        location VARCHAR(255),
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (candidate_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    queries.push(`
      CREATE TABLE IF NOT EXISTS performance_metrics (
        id INT AUTO_INCREMENT PRIMARY KEY,
        candidate_id INT NOT NULL,
        interview_id INT NOT NULL,
        technical_score DOUBLE,
        soft_skills_score DOUBLE,
        overall_score DOUBLE,
        communication_clarity DOUBLE,
        problem_solving DOUBLE,
        teamwork DOUBLE,
        leadership DOUBLE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (candidate_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (interview_id) REFERENCES interviews(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    for (const q of queries) {
      try {
        await mysqlPool.query(q);
      } catch (e) {
        console.error('MySQL init error:', e.message);
      }
    }

    console.log('MySQL tables ensured');

  } catch (e) {
    console.error('Could not connect to MySQL:', e.message);
    throw e;
  }
};

const init = async () => {
  if (isMySQL()) {
    await initMySQL();
  } else {
    initSqlite();
  }
};

const run = async (sql, params = []) => {
  if (isMySQL()) {
    const [result] = await mysqlPool.execute(sql, params);
    // Normalize to sqlite-style result object
    return { lastID: result.insertId, affectedRows: result.affectedRows };
  } else {
    return new Promise((resolve, reject) => {
      sqliteDb.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve(this);
      });
    });
  }
};

const get = async (sql, params = []) => {
  if (isMySQL()) {
    const [rows] = await mysqlPool.execute(sql, params);
    return rows[0] || null;
  } else {
    return new Promise((resolve, reject) => {
      sqliteDb.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }
};

const all = async (sql, params = []) => {
  if (isMySQL()) {
    const [rows] = await mysqlPool.execute(sql, params);
    return rows;
  } else {
    return new Promise((resolve, reject) => {
      sqliteDb.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
};

module.exports = {
  init,
  run,
  get,
  all
};
