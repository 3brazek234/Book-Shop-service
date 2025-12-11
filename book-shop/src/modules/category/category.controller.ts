import { Context } from "hono";

export const createNewCategory = async (c: Context) => {
  try {
    const body = c.body;
    const userId = c.get("userId");
    
  } catch (error) {console.log(error)}
};
