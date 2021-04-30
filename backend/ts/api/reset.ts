import { Request, Response } from "express";
import { API_RES } from "../../../helpers/helpersBack";

export default function reset(req: Request, res: Response) {
    req.session?.destroy(() => true);
    res.send(API_RES.success); 
}