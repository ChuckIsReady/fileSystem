package com.data;

public class User {

	private String password;
	private String name;
	private int storageMAX;
	private int fileNum;
	private int folderNum;
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public int getStorageMAX() {
		return storageMAX;
	}
	public void setStorageMAX(int storageMAX) {
		this.storageMAX = storageMAX;
	}
	public int getFileNum() {
		return fileNum;
	}
	public void setFileNum(int fileNum) {
		this.fileNum = fileNum;
	}
	public int getFolderNum() {
		return folderNum;
	}
	public void setFolderNum(int folderNum) {
		this.folderNum = folderNum;
	}
}
