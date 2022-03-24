/*
 * Copyright @ 2017-present Atlassian Pty Ltd
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.jitsi.meet.sdk;

import android.content.Context;
import android.content.SharedPreferences;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.util.Log;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.uimanager.IllegalViewOperationException;

import java.util.HashMap;
import java.util.Map;

class AppInfoModule
    extends ReactContextBaseJavaModule {

    private static final String TAG = "Token";
    private String tokenValue = "";
    private ReactApplicationContext context;

    public AppInfoModule(ReactApplicationContext reactContext) {

        super(reactContext);

        this.context = reactContext;

        SharedPreferences pref = reactContext.getSharedPreferences("MyPref", 0); // 0 - for private mode
        this.tokenValue = pref.getString("Firebase-Token", null);

    }

    /**
     * Gets a {@code Map} of constants this module exports to JS. Supports JSON
     * types.
     *
     * @return a {@link Map} of constants this module exports to JS
     */
    @Override
    public Map<String, Object> getConstants() {
        Context context = getReactApplicationContext();
        PackageManager packageManager = context.getPackageManager();
        ApplicationInfo applicationInfo;
        PackageInfo packageInfo;

        try {
             String packageName = context.getPackageName();

             applicationInfo
                 = packageManager.getApplicationInfo(packageName, 0);
             packageInfo = packageManager.getPackageInfo(packageName, 0);
        } catch (PackageManager.NameNotFoundException e) {
             applicationInfo = null;
             packageInfo = null;
        }

        Map<String, Object> constants = new HashMap<>();

        constants.put(
            "name",
            applicationInfo == null
                ? ""
                : packageManager.getApplicationLabel(applicationInfo));
        constants.put(
            "version",
            packageInfo == null ? "" : packageInfo.versionName);

        return constants;
    }



    @ReactMethod
    public void getToken(Callback errorCallback, Callback successCallback) {

        SharedPreferences pref = this.context.getSharedPreferences("MyPref", 0); // 0 - for private mode
        this.tokenValue = pref.getString("Firebase-Token", null);

        try {

            successCallback.invoke(this.tokenValue);

        } catch (IllegalViewOperationException e) {

            errorCallback.invoke(e.getMessage());
        }
    }


    @Override
    public String getName() {
        return "AppInfo";
    }
}
