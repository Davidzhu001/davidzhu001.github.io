---
title: Unreal Tips
date: 2024-12-04 15:32:51
---



## 🌟 Gas Related  

### 1. ❓ Why Does My GAS Ability Get Called Multiple Times Before `EndAbility`?  

::: details 🎉Solution:  

🚀 **Problem**:  
Your `GA_Hello` ability is being triggered multiple times before it ends, leading to unexpected behavior. For example, logs show repeated activations like `GA_Hello_C_0`, `GA_Hello_C_1`, etc., even though the previous instance hasn’t finished.  

🔧 **Solution**:  
The issue is likely due to the **Instancing Policy** of your ability. By default, if the policy is set to `InstancedPerActor`, a new instance of the ability is created every time you activate it, even if the previous instance hasn’t ended. This causes the ability to stack and trigger repeatedly.  

Here’s how to fix it:  
1. Open your ability blueprint: `GA_Hello` 🖼️  
2. Go to **Class Defaults** ⚙️  
3. Find the **Instancing Policy** setting 📜  
4. Change it from `InstancedPerActor` to `InstancedPerExecution` ✅  

💡 **Why this works**:  
- `InstancedPerActor` creates a new instance for each actor every time the ability is activated, even if the previous instance is still active.  
- `InstancedPerExecution` ensures only one instance of the ability exists per activation, preventing multiple triggers until the ability ends with `EndAbility`.  

🎉 **Result**:  
Your ability will now only activate once until it properly ends, giving you more control over its behavior!  

---
::: details
