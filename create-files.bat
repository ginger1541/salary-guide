@echo off
REM Location: salary-guide/create-files.bat (프로젝트 루트 디렉토리)
REM Purpose: 프로젝트 기본 파일들 생성 (이미 있는 파일은 건너뜀)

echo ===================================
echo Creating Project Files...
echo ===================================
echo.

REM config 파일들
echo Checking config files...
if not exist "src\config\features.js" (
    echo Creating features.js...
    (
        echo // src/config/features.js
        echo // Feature flags for future enhancements
        echo.
        echo export const features = {
        echo   enableCalculator: false,
        echo   enableComparison: false,
        echo   enablePdfExport: false
        echo }
    ) > src\config\features.js
) else (
    echo features.js already exists - skipping
)

if not exist "src\config\formSchema.js" (
    echo Creating formSchema.js...
    (
        echo // src/config/formSchema.js
        echo // Form structure configuration
        echo.
        echo export const formSchema = {
        echo   sections: []
        echo }
    ) > src\config\formSchema.js
) else (
    echo formSchema.js already exists - skipping
)

echo.

REM JSON 데이터 파일들
echo Checking data files...
if not exist "src\data\rules\2025\kr.json" (
    echo Creating kr.json...
    (
        echo {
        echo   "version": "2025.1.0",
        echo   "effectiveDate": "2025-01-01",
        echo   "country": "KR",
        echo   "currency": "KRW",
        echo   "insuranceRates": {},
        echo   "incomeTaxRates": {}
        echo }
    ) > src\data\rules\2025\kr.json
) else (
    echo kr.json already exists - skipping
)

if not exist "src\data\explanations\ko\insurance.json" (
    echo Creating insurance.json...
    echo {} > src\data\explanations\ko\insurance.json
) else (
    echo insurance.json already exists - skipping
)

if not exist "src\data\explanations\ko\tax.json" (
    echo Creating tax.json...
    echo {} > src\data\explanations\ko\tax.json
) else (
    echo tax.json already exists - skipping
)

if not exist "src\data\explanations\ko\general.json" (
    echo Creating general.json...
    echo {} > src\data\explanations\ko\general.json
) else (
    echo general.json already exists - skipping
)

echo.

REM Utils 파일들
echo Checking utils files...
if not exist "src\utils\validators.js" (
    echo Creating validators.js...
    (
        echo // src/utils/validators.js
        echo // Input validation functions
        echo.
        echo export const validators = {
        echo   // Add validation functions here
        echo }
    ) > src\utils\validators.js
) else (
    echo validators.js already exists - skipping
)

if not exist "src\utils\formatters.js" (
    echo Creating formatters.js...
    (
        echo // src/utils/formatters.js
        echo // Number and text formatting functions
        echo.
        echo export const formatters = {
        echo   // Add formatting functions here
        echo }
    ) > src\utils\formatters.js
) else (
    echo formatters.js already exists - skipping
)

echo.

REM Module index 파일들
echo Checking module files...
if not exist "src\modules\insurance\index.js" (
    echo Creating insurance module index...
    (
        echo // src/modules/insurance/index.js
        echo // Insurance module exports
        echo.
        echo export default {
        echo   // Insurance related logic
        echo }
    ) > src\modules\insurance\index.js
) else (
    echo insurance/index.js already exists - skipping
)

if not exist "src\modules\tax\index.js" (
    echo Creating tax module index...
    (
        echo // src/modules/tax/index.js
        echo // Tax module exports
        echo.
        echo export default {
        echo   // Tax related logic
        echo }
    ) > src\modules\tax\index.js
) else (
    echo tax/index.js already exists - skipping
)

if not exist "src\modules\allowance\index.js" (
    echo Creating allowance module index...
    (
        echo // src/modules/allowance/index.js
        echo // Allowance module exports
        echo.
        echo export default {
        echo   // Allowance related logic
        echo }
    ) > src\modules\allowance\index.js
) else (
    echo allowance/index.js already exists - skipping
)

echo.

REM .gitkeep 파일
echo Checking .gitkeep files...
if not exist "src\plugins\.gitkeep" (
    echo Creating plugins/.gitkeep...
    echo. > src\plugins\.gitkeep
) else (
    echo plugins/.gitkeep already exists - skipping
)

echo.
echo ===================================
echo File creation completed!
echo ===================================
echo.
pause