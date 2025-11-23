import type { Response } from 'express';
export declare class UploadsController {
    getAvatar(filename: string, res: Response): Promise<void>;
}
