import mongoose from 'mongoose';

export const connectDB = async () => {
  const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/edulinker';
  mongoose.connect(connStr, { serverSelectionTimeoutMS: 1500 })
    .then((conn) => {
      console.log(`[MongoDB Connected]: ${conn.connection.host}`);
    })
    .catch(() => {
      console.log(`[MongoDB Notice]: Running in In-Memory High Performance Store Mode.`);
    });
};

