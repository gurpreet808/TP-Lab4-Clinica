import { Injectable } from '@angular/core';
import { Storage, StorageReference, deleteObject, getDownloadURL, ref, uploadBytesResumable } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class FileHandlerService {

  constructor(public storage: Storage) { }

  uploadFile(file: File, path: string) {
    let storageRef: StorageReference = ref(this.storage, path);
    return uploadBytesResumable(storageRef, file);
  }

  deleteFile(path: string) {
    let storageRef: StorageReference = ref(this.storage, path);
    return deleteObject(storageRef);
  }

  getDownloadURL(path: string) {
    return getDownloadURL(ref(this.storage, path));
  }

  async uploadFileAndGetURL(file: File, path: string) {
    let uploadTask = this.uploadFile(file, path);
    await uploadTask;
    return this.getDownloadURL(path);
  }
}