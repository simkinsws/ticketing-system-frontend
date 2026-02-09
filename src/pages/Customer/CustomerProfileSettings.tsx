import { useState } from "react";
import FileUpload from "../../components/FileUpload/FileUpload";
import "./styles/CustomerProfileSettings.scss";

export const CustomerProfileSettings = () => {
  const [file, setFile] = useState<File | null>(null);
  // For testing file upload - can be removed later
  // const fd = new FormData();
  // if (file) fd.append("file", file);
  // console.log(fd.get("file"));
  return (
    <div className="customer-profile-settings-container">
      <h1>Profile Settings</h1>
      <FileUpload value={file} onFileChange={setFile} />
    </div>
  );
};
