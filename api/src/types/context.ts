import { Request } from "express";
import { IJWT } from "./authorization";

export interface IContext {
	auth: IJWT,
	req: Request
}