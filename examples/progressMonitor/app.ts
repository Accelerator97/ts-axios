import axios from "../../src/axios";

const instance = axios.create({
  onDownloadProgress: (ProgressEvent) =>{
    const load = ProgressEvent.loaded;
    const total = ProgressEvent.total;
    const progress = (load / total) * 100;
    console.log('下载进度')
    console.log(progress);
  },
  onUploadProgress: (ProgressEvent)=> {
    const load = ProgressEvent.loaded;
    const total = ProgressEvent.total;
    const progress = (load / total) * 100;
    console.log('上传进度')
    console.log(progress);
  }
});

// const downloadBtn = document.getElementById("download");
// downloadBtn!.onclick = function() {
//   instance.get("upload-download/download");
// };

const uploadBtn = document.getElementById("upload");
uploadBtn!.onclick = function() {
  const data = new FormData();
  const file = document.getElementById("file") as HTMLInputElement;
  if (file.files) {
    data.append("file", file.files[0]);
    instance.post("/upload-download/upload", data);
  }
};