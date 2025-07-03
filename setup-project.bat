@echo off
REM Location: salary-guide/setup-project.bat (프로젝트 루트 디렉토리)
REM Purpose: 프로젝트 디렉토리 구조 및 기본 파일 생성

echo ===================================
echo Setting up Salary Guide Project...
echo ===================================

REM 디렉토리 생성
echo Creating directories...

REM components 구조
mkdir src\components\common 2>nul
mkdir src\components\form 2>nul
mkdir src\components\report 2>nul

REM modules 구조
mkdir src\modules\insurance 2>nul
mkdir src\modules\tax 2>nul
mkdir src\modules\allowance 2>nul

REM data 구조
mkdir src\data\rules\2025 2>nul
mkdir src\data\explanations\ko 2>nul

REM config 구조
mkdir src\config 2>nul
mkdir src\plugins 2>nul

REM utils 구조
if not exist src\utils mkdir src\utils

echo Directories created successfully!
echo.

REM 기본 파일 생성
echo Creating initial files...

REM .gitkeep 파일
echo. > src\plugins\.gitkeep

REM config 파일들
echo // src/config/features.js > src\config\features.js
echo // Feature flags for future enhancements >> src\config\features.js
echo export const features = { >> src\config\features.js
echo   enableCalculator: false, >> src\config\features.js
echo   enableComparison: false, >> src\config\features.js
echo   enablePdfExport: false >> src\config\features.js
echo } >> src\config\features.js

echo // src/config/formSchema.js > src\config\formSchema.js

REM JSON 파일들 (빈 객체로 초기화)
echo {} > src\data\rules\2025\kr.json
echo {} > src\data\explanations\ko\insurance.json
echo {} > src\data\explanations\ko\tax.json
echo {} > src\data\explanations\ko\general.json

REM utils 파일들
echo // src/utils/validators.js > src\utils\validators.js
echo // src/utils/formatters.js > src\utils\formatters.js

echo Files created successfully!
echo.
echo ===================================
echo Setup completed!
echo ===================================
echo.
pause