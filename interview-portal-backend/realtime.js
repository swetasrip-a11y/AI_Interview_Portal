let io = null;

module.exports = {
  setIO: (socketIo) => {
    io = socketIo;
  },
  getIO: () => io,
};
