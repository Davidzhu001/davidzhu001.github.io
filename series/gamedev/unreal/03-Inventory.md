---
title: 3.库存系统
date: 2024-12-04 15:32:51
---

## 在 Unreal Engine 中实现物品交互和库存系统

在游戏开发中，物品交互和库存系统是非常常见的功能。通过以下步骤，我们将学习如何在 Unreal Engine 中实现这些功能，包括创建轮廓材质、交互组件、UI 提示以及库存系统。

---

### 1. 创建轮廓材质

物品交互的一个重要视觉提示是突出显示物品的轮廓。我们将通过材质和后处理来实现。

#### 步骤：
1. **创建材质**：
   - 在内容浏览器中右键，选择 **Material** 创建一个新的材质（命名为 `OutlineMaterial`）。
  
<img src='/unreal/03.inventory/outline_material.png'>

:::info 备注
中间我们设置了两个参数为可控参数， 1.thinkness 2. color
:::
---

### 2. 在靠近物品时显示轮廓

我们希望轮廓效果只在玩家靠近物品时出现。

#### 步骤：
1. **创建一个BP Actor**：

2. **检测物品进入范围**：
   - 在触发器的 **OnComponentBeginOverlap** 和 **OnComponentEndOverlap** 事件中，检查是否是可交互物品。
   - 设置overlay的 visibility

3. **优化逻辑**：
   - 使用标签或接口来标识可交互物品，避免不必要的逻辑判断。
<img src='/unreal/03.inventory/interact_bp.png'>

   

---

### 3. 创建“按E键交互”提示

为了让玩家知道可以与物品交互，我们需要一个简单的 UI 提示。

#### 步骤：
1. **创建交互提示小部件**：
   - 在内容浏览器中，右键选择 **User Interface > Widget Blueprint**，命名为 `InteractWidget`。
   - 打开小部件编辑器，添加一个文本框，设置为“Press E to Interact”。
   <img src='/unreal/03.inventory/ui_widget.png' width='120'>


2. **创建一个Input Map Content**：

   <img src='/unreal/03.inventory/IMC.png' width='299'>

3. **绑定按键事件**：
   - 在玩家角色的蓝图中，监听 **E 键**事件。
   - 当玩家按下 **E 键**时，触发与物品的交互逻辑。

---

### 4. 创建库存组件

接下来，我们需要一个库存系统来存储玩家拾取的物品。

#### 步骤：
1. **定义物品数据结构**：
   - 在内容浏览器中，右键选择 **Blueprint > Structure**，命名为 `ItemStruct`。
   - 在结构体中定义以下字段：
     - **Name**（物品名称，类型为 String）
     - **Icon**（物品图标，类型为 Texture2D）
     - **Quantity**（物品数量，类型为 Integer）

2. **创建库存组件**：
   - 创建一个 **Actor Component**，命名为 `InventoryComponent`。
   - 在组件中创建一个数组变量，类型为 `ItemStruct`，用于存储物品。

3. **实现添加和移除物品的逻辑**：
   - 创建函数 `AddItem` 和 `RemoveItem`，分别用于向库存中添加和移除物品。
   - 在 `AddItem` 中，检查物品是否已存在，若存在则增加数量，否则创建新项。

---

### 5. 创建交互接口

为了让不同的物品具有交互功能，我们需要创建一个交互接口。

#### 步骤：
1. **创建蓝图接口**：
   - 在内容浏览器中，右键选择 **Blueprint > Blueprint Interface**，命名为 `InteractInterface`。
   - 在接口中定义一个函数 `Interact`，不需要输入或输出参数。

2. **实现接口**：
   - 在所有可交互物品的蓝图中实现 `InteractInterface`。
   - 在 `Interact` 函数中定义物品的具体交互逻辑，例如拾取、打开箱子等。

3. **调用接口**：
   - 在玩家角色蓝图中，当玩家按下 **E 键**时，检查当前物品是否实现了 `InteractInterface`，若是则调用其 `Interact` 函数。

---

### 6. 整合与测试

#### 步骤：
1. **整合逻辑**：
   - 在玩家靠近物品时，显示轮廓和交互提示。
   - 按下 **E 键**后，调用物品的交互逻辑，并将物品添加到库存中。

2. **测试功能**：
   - 在场景中放置几个可交互物品，确保轮廓、提示和交互逻辑正常工作。
   - 检查物品是否正确添加到库存中。

---

### 知识点总结

通过本教程，你将掌握以下知识点：
- **材质与后处理**：学习如何创建轮廓材质并应用到物品上。
- **蓝图事件系统**：通过触发器和按键事件实现交互逻辑。
- **UMG 用户界面**：使用 UMG 创建交互提示和动态 UI。
- **组件与接口**：通过组件管理库存，通过接口实现模块化交互。

---

### 最终效果

- 玩家靠近物品时，物品会显示轮廓并弹出“按 E 键交互”的提示。
- 按下 **E 键**后，物品将被拾取并添加到库存中。

---

通过以上步骤，你已经完成了一个基础的物品交互和库存系统。如果需要更复杂的功能（如分类、装备物品等），可以在此基础上进行扩展！

希望这篇教程对你有所帮助！如果有问题，欢迎留言讨论！ 😊