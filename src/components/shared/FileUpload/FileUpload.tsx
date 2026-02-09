import "./styles/FileUpload.scss";
import uploadIcon from "../../../assets/file-upload.svg";
type FileUploadProps = {
  value?: File | null;
  onFileChange?: (file: File | null) => void;
};

const FileUpload = ({ value = null, onFileChange }: FileUploadProps) => {
  const allowedExtensions = new Set([
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".pdf",
    ".doc",
    ".docx",
    ".txt",
    ".zip",
  ]);

  const allowedMimeTypes = new Set([
    "image/jpeg",
    "image/png",
    "image/gif",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "application/zip",
  ]);

  const isAllowedFile = (file: File) => {
    const name = file.name.toLowerCase();
    const ext = name.includes(".") ? name.slice(name.lastIndexOf(".")) : "";
    return allowedExtensions.has(ext) && allowedMimeTypes.has(file.type);
  };

  const handleFile = (file: File | undefined) => {
    if (!file) {
      onFileChange?.(null);
      return;
    }

    if (!isAllowedFile(file)) {
      onFileChange?.(null);
      return;
    }

    onFileChange?.(file);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    handleFile(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    handleFile(file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  };

  return (
    <div className="file-upload-container">
      <input
        type="file"
        id="file"
        className="file-input"
        accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.txt,.zip,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf,image/jpeg,image/png,image/gif,text/plain,application/zip"
        onChange={handleFileChange}
      />
      <label
        htmlFor="file"
        className="file-upload-block"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <img src={uploadIcon} alt="Upload Icon" />
        <p className="file-upload-title">
          {value?.name ?? "Drag file here or click to browse"}
        </p>
        <p className="file-upload-supported">
          Allowed: JPG, JPEG, PNG, GIF, PDF, DOC, DOCX, TXT, ZIP
        </p>
        <p className="file-upload-size">Maximum file size: 10MB </p>
      </label>
    </div>
  );
};

export default FileUpload;
