interface FileUpload {
    buffer: Buffer;
    mimetype: string;
    originalname: string;
}
export declare class CloudinaryService {
    uploadImage(file: FileUpload, folder?: string): Promise<string>;
    deleteImage(publicId: string): Promise<void>;
    extractPublicId(url: string): string | null;
}
export {};
