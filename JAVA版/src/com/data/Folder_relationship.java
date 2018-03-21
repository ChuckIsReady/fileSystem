package com.data;

public class Folder_relationship {
	
 private int fileID;
 private String childrenFileIDArr ;
 private int parentFolderID;
 
 
public int getFileID() {
	return fileID;
}
public void setFileID(int fileID) {
	this.fileID = fileID;
}
public String getChildrenFileIDArr() {
	return childrenFileIDArr;
}
public void setChildrenFileIDArr(String string) {
	this.childrenFileIDArr = string;
}
public int getParentFolderID() {
	return parentFolderID;
}
public void setParentFolderID(int parentFolderID) {
	this.parentFolderID = parentFolderID;
} 
}
