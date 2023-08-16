import React, { useState } from "react";
import { getStorage, ref, uploadBytesResumable, getDownloadURL  } from "firebase/storage";
import { app } from "./firebase";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';

function Test() {
  const [image, setImage] = useState<File | null>(null);
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const onSubmit = async () => {
    const storage = getStorage(app);
    const fileRef = ref(storage, 'image/달');
    if (image) {
      console.log("start 업로드");
      
     const uploadTask = uploadBytesResumable(fileRef, image);

      console.log("done 업로드");
      
      uploadTask.on('state_changed', 
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      }, 
      (error) => {
        console.log(error);
      }, 
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
        });
      }
    );
    
      
      // const response = await uploadString(fileRef, src, 'data_url');
      // console.log(response);
    }
  }

    return (
      <>
      <ReactQuill modules={modules}></ReactQuill>
        <input type="file" onChange={handleImageChange} />
        <div onClick={onSubmit}>업로드</div>
      </>
    );
  };


export default Test;


const modules = {
  toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [] }],
        [{ 'align': [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, 'link'],
        [{ 'color': ['#000000', '#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9933ff', '#ffffff', '#facccc', '#ffebcc', '#ffffcc', '#cce8cc', '#cce0f5', '#ebd6ff', '#bbbbbb', '#f06666', '#ffc266', '#ffff66', '#66b966', '#66a3e0', '#c285ff', '#888888', '#a10000', '#b26b00', '#b2b200', '#006100', '#0047b2', '#6b24b2', '#444444', '#5c0000', '#663d00', '#666600', '#003700', '#002966', '#3d1466', 'custom-color'] }, { 'background': [] }],
        ['image', 'video'],
        ['clean']  
      ],
  }
}