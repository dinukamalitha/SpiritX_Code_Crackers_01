import bcrypt from "bcrypt";

export const hashPassword = async (password: string, saltRounds:number)=> {
    return await bcrypt.hash(password, saltRounds);
}

export const comparePassword = async (password: string, hashedPassword: string)=> {
    return await bcrypt.compare(password, hashedPassword).catch((err:Error) => false);
}