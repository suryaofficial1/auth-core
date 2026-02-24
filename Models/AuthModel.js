import db from "../config/db.js";

const authModel = {};

authModel.getUserByEmail = async (email) => {
    const connection = await db.getConnection();
    try {
        const sql = `select * from user_master where email = ?`
        const [result] = await connection.query(sql, [email]);
        return result;

    } finally{
        connection.release();
    }
};

authModel.createUser = async (body) => {
    const connection = await db.getConnection();
    try {
        const sql = `insert into user_master (f_name, l_name, email, password) values (?,?,?,?)`;
        const [result] = await connection.query(sql, [body.firstName, body.lastName, body.email, body.password]);
        return result;
    } finally {
        connection.release();
    }
};

authModel.sendOtp = async (body) => {
    const connection = await db.getConnection();
    try {
        const sql = `insert into u_otp (user_id, ip, user_agent, otp, status, contact, created_on) values (?,?,?,?,?,?, now())`;
         await connection.query(sql, [body.id, body.ip, body.userAgent, body.otp, body.status, body.contact]);
        return true;
    } finally {
        connection.release();
    }
};
authModel.getOtpEmail = async (contact) => {
    const connection = await db.getConnection();
    try {
        const sql = `select id, user_id userId, otp from u_otp where contact = ? order by id desc`;
        const [[result]] = await connection.query(sql, [contact]);
        return result;

    } finally{
        connection.release();
    }
};
authModel.verifyCode = async ({id, userId, status}) => {
    const connection = await db.getConnection();
    try {
        const sql = `update u_otp set status = ? where id = ? and user_id = ?`;
         await connection.query(sql, [status, id, userId]);
        return true;

    } finally{
        connection.release();
    }
};

authModel.updatePassword = async (body) => {
    const connection = await db.getConnection();
    try {
        const sql = `update user_master set password = ? where email = ?`;
         await connection.query(sql, [body.password, body.email]);
        return true;

    } finally{
        connection.release();
    }
}

export default authModel;