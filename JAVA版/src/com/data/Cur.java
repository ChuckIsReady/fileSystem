package com.data;

import java.util.List;

public class Cur {
 private String curUserName;
 private int curUserFileNum;
 private int curUserfolderNum;
 private int curUserstorageMAX;
 private String curFolderOwner;
 private int curFolderID;
 private List<String> curFileNameArr;
 public String getCurUserName() {
	return curUserName;
}
public void setCurUserName(String curUserName) {
	this.curUserName = curUserName;
}
public int getCurUserFileNum() {
	return curUserFileNum;
}
public void setCurUserFileNum(int curUserFileNum) {
	this.curUserFileNum = curUserFileNum;
}
public int getCurUserfolderNum() {
	return curUserfolderNum;
}
public void setCurUserfolderNum(int curUserfolderNum) {
	this.curUserfolderNum = curUserfolderNum;
}
public int getCurUserstorageMAX() {
	return curUserstorageMAX;
}
public void setCurUserstorageMAX(int curUserstorageMAX) {
	this.curUserstorageMAX = curUserstorageMAX;
}
public String getCurFolderOwner() {
	return curFolderOwner;
}
public void setCurFolderOwner(String curFolderOwner) {
	this.curFolderOwner = curFolderOwner;
}
public int getCurFolderID() {
	return curFolderID;
}
public void setCurFolderID(int curFolderID) {
	this.curFolderID = curFolderID;
}
public List<String> getCurFileNameArr() {
	return curFileNameArr;
}
public void setCurFileNameArr(List<String> curFileNameArr) {
	this.curFileNameArr = curFileNameArr;
}
public List<List<?>> getCurFoloderFileArr() {
	return curFoloderFileArr;
}
public void setCurFoloderFileArr(List<List<?>> curFoloderFileArr) {
	this.curFoloderFileArr = curFoloderFileArr;
}
public List<List<?>> getBreadcrumbStack() {
	return breadcrumbStack;
}
public void setBreadcrumbStack(List<List<?>> breadcrumbStack) {
	this.breadcrumbStack = breadcrumbStack;
}
private List<List<?>> curFoloderFileArr;
 private List<List<?>> breadcrumbStack;
}
