package org.jitsi.meet;

import android.app.Application;

import com.facebook.react.ReactApplication;
import io.branch.rnbranch.RNBranchPackage;
import io.branch.referral.Branch;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;


import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage()
            );
        }

    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

//    // add onCreate() override
//    @Override
//    public void onCreate() {
//        super.onCreate();
//        Branch.getAutoInstance(this);
//    }

}
