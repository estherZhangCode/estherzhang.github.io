---
title: Use XCConfigs
commentable: flase
Edit: 2022-04-14
mathjax: true
mermaid: true
tags: iOS
categories: swift
description: Use XCConfigs
---

XCConfig is the best way to manage variables in Info.plist. It has the power of template including, variable overriding. 
Which means you can create separate xcconfig files for each configs. Thus makes the configs more maintanable.

## Get Started
### Use the boilerplate
There are already different sets of xcconfig files in the boilerplate, just delete what you don’t need and update the values to corresponding configs and you are good to go.
 
### Brandnew project
1. Create various xcconfig files for each of your configurations, don’t add to any target as the config file shouldn’t be built into App bundles.

2. Organize them in an XCConfig folder.

3. Write key values in the xcconfig file, recommend using #include  to reduce duplicate keyvalues. You can also override a value defined in previous xcconfig file.

If you are also using cocoapods, remember to include reference to cocoapods xcconfig.

```
#include "../Pods/Target Support Files/Pods-AdidasConfirmed/Pods-AdidasConfirmed.debug(blue).xcconfig"
```
 
4. Specify the xcconfig in project info tab

5. Use variables in info.plist.
 
Ref
- Edit Xcode xcconfig file and Cocoapods 
- Building Your App Using Build Configurations and .xcconfig 
- The Unofficial Guide to xcconfig files
