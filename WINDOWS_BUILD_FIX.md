# Windows Build Fix for React Native Reanimated

## Problem
You're encountering a CMake build error with `react-native-reanimated` on Windows:
```
ninja: error: mkdir(src/main/cpp/reanimated/CMakeFiles/reanimated.dir/D_/Project/...): No such file or directory
```

This is caused by Windows' default 260-character path length limitation. Your project path is too long for CMake to create the necessary build directories.

## Solutions (in order of recommendation)

### Solution 1: Enable Windows Long Path Support (RECOMMENDED)

This is the proper fix that will resolve the issue permanently.

**Option A: Using PowerShell (as Administrator)**
1. Right-click PowerShell and select "Run as Administrator"
2. Run the provided script:
   ```powershell
   .\enable-long-paths.ps1
   ```
   Or manually run:
   ```powershell
   Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled" -Value 1
   ```
3. **Restart your computer** (required for changes to take effect)
4. After restart, rebuild your project

**Option B: Using Group Policy Editor (Windows Pro/Enterprise)**
1. Press `Win + R`, type `gpedit.msc`, press Enter
2. Navigate to: `Local Computer Policy > Computer Configuration > Administrative Templates > System > Filesystem`
3. Find and enable: `Enable Win32 long paths`
4. Restart your computer

### Solution 2: Move Project to Shorter Path (QUICK FIX)

Move your project to a shorter path to reduce the overall path length:
- **From:** `D:\Project\Karomanage-mobile-android\Karomanage-mobile-app\`
- **To:** `D:\Karomanage\` or `C:\Projects\Karo\`

This will immediately reduce path lengths and may resolve the issue without requiring admin access.

### Solution 3: Build with Fewer Architectures (TEMPORARY WORKAROUND)

I've temporarily reduced the architectures in `android/gradle.properties` to `arm64-v8a,x86_64` instead of all four. This reduces the number of CMake builds and may help avoid the path length issue.

**To restore all architectures after fixing the path issue:**
Change in `android/gradle.properties`:
```properties
reactNativeArchitectures=armeabi-v7a,arm64-v8a,x86,x86_64
```

## Current Configuration

- **Architectures:** Reduced to `arm64-v8a,x86_64` (temporary)
- **Build cache:** Cleaned
- **CMake cache:** Should be cleaned on next build

## Next Steps

1. **Try Solution 1 first** (enable long paths) - this is the best long-term solution
2. If you can't enable long paths, try **Solution 2** (move project)
3. **Solution 3** is already applied as a temporary workaround

After applying Solution 1 or 2, you can restore all architectures in `gradle.properties`.

## Testing the Build

After applying a solution, try building:
```powershell
cd android
.\gradlew assembleDebug
```

Or run your app:
```powershell
npm run android
```

