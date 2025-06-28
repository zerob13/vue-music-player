#!/bin/bash

# 下载一些免费测试音频文件
echo "正在下载测试音频文件..."

cd public/audio

# 下载一些短的测试音频文件
curl -L -o test1.wav "https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav"
curl -L -o test2.wav "https://www2.cs.uic.edu/~i101/SoundFiles/CantinaBand60.wav"
curl -L -o test3.wav "https://www2.cs.uic.edu/~i101/SoundFiles/ImperialMarch60.wav"
curl -L -o test4.wav "https://www2.cs.uic.edu/~i101/SoundFiles/PinkPanther60.wav"
curl -L -o test5.wav "https://www2.cs.uic.edu/~i101/SoundFiles/StarWars60.wav"

echo "测试音频文件下载完成！"
echo "文件保存在 public/audio/ 目录下"
