[![Englsh](https://img.shields.io/badge/language-English-orange.svg)](README.md) [![Korean](https://img.shields.io/badge/language-Korean-blue.svg)](README_kr.md)

[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/monsweeks/shareplates-app/issues)

# SHAREPLATES
SHAREPLATES는 컨텐츠 공유를 위해 필요한 다양한 기능을 제공하는 소프트웨어입니다. SHAREPLATES 하나를 통해, 자유롭게 컨텐츠를 설계하고, 컨텐츠를 제작할 수 있으며, 제작한 컨텐츠를 다양한 디바이스의 사용자와 함께 실시간으로 공유할 수 있습니다. 지금까지 세상에 존재하지 않았던 스마트한 컨텐츠 공유 시스템을 만나보세요.
 
모바일을 통한 진행
- 모바일 디바이스를 가지고 있다면, 진행을 위한 별도의 포인팅 도구가 필요없습니다. 모바일을 통해 스마트하게 진행하며, 더 효과적으로 컨텐츠를 스크롤하며, 포인팅할 수 있습니다.

강력한 동기화 기능
- 프로젝터가 없어도, 포인팅 기능이 없어도, 별도의 PC가 없는 환경에서도 사용자 각자의 다양한 디바이스로 공유에 참여할 수 있습니다. 진행자의 진행에 따라 참여자들의 디바이스에 동기화된 컨텐츠가 출력됩니다. 협소한 장소에서도, 원격에서도 시간과 장소에 제약으로부터 자유로운 컨텐츠 공유 환경을 경험할 수 있습니다.
   
모바일을 통한 스마트한 진행
- 모바일을 통해 현재 참여중인 사용자의 정보를 확인하고 관리할 수 있습니다. 또한 컨텐츠를 진행하거나, 화면에 특정 요소를 포인팅하고, 스크롤 할 수 있습니다. 이러한 모든 행위는 참여 중인 모든 사용자에게 동일하게 표시됩니다. 참여자들의 참여 여부, 집중도, 컨텐츠의 진행 상황등을 실시간으로 파악할 수 있어, 이를 통해 컨텐츠를 공유하는 각 순간의 상황에 대한 즉각적인 피드백 정보를 알 수 있습니다.
  
쉽고 편리한 컨텐츠 설계 및 제작
- 토픽, 챕터, 페이지로 단계별로 컨텐츠를 설계하고, 쉽게 컨텐츠를 만들고, 순서를 변경할 수 있습니다. 전용의 컨텐츠 에디터를 통해 쉽고 빠르게 반응형 컨텐츠를 만들 수 있습니다. 프라이빗한 개인 컨텐츠를 만들거나, 조직이나 관심사가 같은 그룹별로 공동의 컨텐츠를 만들고 함께 관리할 수 있습니다.

디바이스 최적화
- 사용자의 PC를 비롯한, 프로젝터, 모바일 등 컨텐츠 공유 환경에 제공되는 다양한 디바이스를 최대한 활용할 수 있습니다. 프로젝터를 통해 컨텐츠를 함께 보도록 역할을 부여할 수 있으며, 접속한 모바일을 통해 컨텐츠를 진행하거나, 사용자를 관리할 수 있습니다. 접속한 브라우저에 역할을 부여하여, 하나의 액션을 통해 여러 디바이스가 최적의 컨텐츠 공유를 위한 기능을 수행합니다.

## 소개
- [소개 페이지](https://monsweeks.github.io/shareplates-app/)

## SHAREPLATES 설치
SHAREPLATES는 FRONT, API 두 개의 프로젝트로 구성되어 있으며, 아래의 링크를 통해 최신의 소스 코드를 사용할 수 있습니다.
 - https://github.com/monsweeks/shareplates-app
 - https://github.com/monsweeks/shareplates-api

SHAREPLATES 사용을 위해 아래 프로그램이 설치되어 있으며, 설정을 통해 연결할 수 있어야 합니다.
 - REDIS
 - RDB (MYSQL)
 - influxdb
 - Servlet Container (Tomcat)

SHAREPLATES 실행 
  - https://github.com/monsweeks/shareplates-app/releases (또는 https://github.com/monsweeks/shareplates-api/releases)의 최신 릴리즈 파일을 다운로드합니다.
  - 첨부된 application.yml의 내용을 참조하여, 실행에 필요한 REDIS, RDB, influxdb 접속 정보를 입력합니다.
  - 폴더내의 start.sh (또는 start.bat) 파일을 실행합니다.
    
## 다운로드
아래 페이지에서 최신 버전을 다운로드 할 수 있습니다.
- [Release](https://github.com/monsweeks/shareplates-app/releases/)

## 라이선스
Licensed under the Apache License, Version 2.0
