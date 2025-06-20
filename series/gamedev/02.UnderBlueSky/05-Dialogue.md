---
title: 4. Dialogue Component 蓝图调用手册
date: 2023-12-24 15:32:51
---

## 概述

`UUbsDialogue` 是一个 Unreal Engine 数据资产类，设计用于管理游戏中的对话系统。它支持多态节点（包括对话节点和选择节点）、任务、条件和状态机驱动的对话流程。该类通过蓝图可调用函数和事件，允许开发者在不编写 C++ 代码的情况下实现复杂的对话交互。

本文档为蓝图开发者提供详细指导，说明如何在 Unreal Engine 中使用 `UUbsDialogue` 类，包括加载对话资产、启动对话、处理事件、添加节点以及调试方法。文档假设开发者熟悉 Unreal Engine 蓝图基础，并已将对话系统相关 C++ 代码（`UbsDialogue.h` 等）集成到项目中。

---

## 功能

- **对话管理**：通过状态机控制对话流程，支持运行、暂停、恢复和结束对话。
- **节点支持**：处理对话节点（`UUbsDialogueNode`）和选择节点（`UUbsChoiceNode`），支持文本显示和玩家选择。
- **事件系统**：通过 `OnDialogueEvent` 委托广播对话事件（如节点进入、选择确认、任务完成）。
- **任务和条件**：支持 `UUbsDialogueTask` 和 `UUbsDialogueCondition`，允许自定义对话逻辑。
- **蓝图集成**：提供蓝图可调用函数和可读属性，简化 UI 集成和游戏逻辑。
- **验证**：内置对话图验证功能，检测无效节点或循环链接。

---

## 环境设置

### 前提条件

1. **Unreal Engine 项目**：
   - 使用 Unreal Engine 5.x（推荐 5.3 或更高）。
   - 项目包含 `UBSRPG` 模块，包含以下文件：
     - `UbsDialogue.h/cpp`
     - `UbsDialogueNodeBase.h/cpp`
     - `UbsDialogueNode.h/cpp`
     - `UbsChoiceNode.h/cpp`
     - `UbsDialogueTask.h/cpp`
     - `UbsDialogueCondition.h/cpp`
     - `UbsDialogueContext.h/cpp`
   - 在 `UBSRPG.Build.cs` 中添加依赖：
     ```csharp
     PublicDependencyModuleNames.AddRange(new string[] { "Core", "CoreUObject", "Engine" });
     ```

2. **对话资产**：
   - 创建 `UUbsDialogue` 数据资产，或通过 `UUbsDialogueJsonConverter` 从 JSON 生成。
   - 确保资产包含配置好的 `Nodes` 数组（包含 `UUbsDialogueNode` 和 `UUbsChoiceNode` 实例）。

3. **蓝图环境**：
   - 熟悉蓝图编辑器，了解如何创建变量、调用函数和绑定事件。
   - 准备 UI 蓝图（Widget Blueprint）以显示对话文本和选择选项。

---

## 蓝图调用方法

### 1. 加载对话资产

在蓝图中，首先需要加载 `UUbsDialogue` 数据资产。

- **步骤**：
  1. 创建一个变量：
     - 类型：`UbsDialogue`（对象引用）。
     - 名称：例如 `DialogueAsset`。
     - 默认值：从内容浏览器拖入 `UUbsDialogue` 资产。
  2. 或者动态加载：
     - 使用 `Load Object` 节点。
     - 设置 `Class = UbsDialogue`。
     - 输入资产路径（例如 `/Game/Dialogue/SampleDialogue`）。
     - 连接输出到 `DialogueAsset` 变量。

- **示例**：
  ![加载对话资产](https://example.com/load_dialogue_asset.png) <!-- 替换为实际截图 -->
  - 拖入 `DialogueAsset` 变量，设置默认值为 `/Game/Dialogue/SampleDialogue`。

### 2. 启动对话

使用 `StartDialogue` 函数启动对话流程。

- **函数**：`StartDialogue`
  - **输入**：
    - `Target`：`UbsDialogue` 实例（例如 `DialogueAsset`）。
    - `InGameInstance`：当前 `GameInstance`（通过 `Get Game Instance` 获取）。
  - **调用方式**：
    1. 拖入 `DialogueAsset` 变量，右键选择 `StartDialogue`。
    2. 连接 `Get Game Instance` 到 `InGameInstance` 输入。
    3. 在触发事件中调用（例如 `OnInteract` 或 `BeginPlay`）。

- **示例**：
  ![启动对话](https://example.com/start_dialogue.png)
  - 在 NPC 交互事件中调用 `StartDialogue`。

### 3. 处理对话事件

通过绑定 `OnDialogueEvent` 委托，处理对话状态变化（如显示文本、选项或任务更新）。

- **事件**：`OnDialogueEvent`
  - **输出**：`Event`（`FDialogueEvent` 结构），包含：
    - `EventType`：事件类型（如 `NodeEntered`, `ChoiceSelected`）。
    - `NodeId`：当前节点 ID。
    - `Dialogue`：对话实例。
    - `ContextObject`：上下文对象（例如任务或条件）。
    - `EventMessage`：错误或调试信息。
  - **绑定方式**：
    1. 拖入 `DialogueAsset` 变量，找到 `OnDialogueEvent`。
    2. 右键选择 `Add Event > Add OnDialogueEvent`。
    3. 使用 `Break DialogueEvent` 节点分解 `Event` 结构。
    4. 根据 `EventType` 执行逻辑（例如更新 UI）。

- **关键事件类型**：
  - `NodeEntered`：进入新节点，显示对话文本或选项。
  - `ChoiceSelected`：玩家选择选项，更新对话流程。
  - `TaskStarted`/`TaskCompleted`：任务开始或完成，更新游戏状态。
  - `DialogueEnded`：对话结束，关闭 UI。
  - `ErrorEncountered`：处理错误（通过 `EventMessage`）。

- **示例**：
  ![处理对话事件](https://example.com/handle_dialogue_event.png)
  - 绑定 `OnDialogueEvent`，检查 `EventType`：
    - 如果是 `NodeEntered`，获取 `NodeId`，使用 `GetNodeById` 获取节点。
    - 如果节点是 `UbsDialogueNode`，显示 `NodeText`。
    - 如果节点是 `UbsChoiceNode`，显示 `ChoiceOptions`。

### 4. 推进对话

使用 `AdvanceDialogue` 函数推进对话流程，特别是在选择节点时传递玩家选择的节点 ID。

- **函数**：`AdvanceDialogue`
  - **输入**：
    - `Target`：`UbsDialogue` 实例。
    - `SelectedNodeId`：玩家选择的节点 ID（默认为 -1，自动选择第一个有效节点）。
  - **调用方式**：
    1. 在选择节点事件中（例如玩家点击选项按钮），调用 `AdvanceDialogue`。
    2. 如果是选择节点，从 `UbsChoiceNode` 的 `ChoiceLinkedNodeIds` 获取对应 ID，传入 `SelectedNodeId`。

- **示例**：
  ![推进对话](https://example.com/advance_dialogue.png)
  - 在 UI 按钮点击事件中：
    - 获取 `UbsChoiceNode` 的 `ChoiceLinkedNodeIds` 数组。
    - 根据玩家选择的索引（例如 0 或 1），传入对应的 `NodeId`。

### 5. 暂停和恢复对话

使用 `PauseDialogue` 和 `ResumeDialogue` 控制对话流程。

- **函数**：
  - `PauseDialogue`：暂停对话，进入 `Paused` 状态。
  - `ResumeDialogue`：恢复对话，继续当前节点。
  - **调用方式**：
    1. 拖入 `DialogueAsset`，选择 `PauseDialogue` 或 `ResumeDialogue`。
    2. 在特定事件中调用（例如暂停菜单打开/关闭）。

- **示例**：
  ![暂停和恢复对话](https://example.com/pause_resume_dialogue.png)
  - 在暂停菜单打开时调用 `PauseDialogue`。
  - 在恢复游戏时调用 `ResumeDialogue`。

### 6. 结束对话

使用 `EndDialogue` 手动结束对话。

- **函数**：`EndDialogue`
  - **调用方式**：
    1. 拖入 `DialogueAsset`，选择 `EndDialogue`。
    2. 在特定条件下调用（例如玩家取消对话）。

- **示例**：
  ![结束对话](https://example.com/end_dialogue.png)
  - 在 UI 的“取消”按钮点击事件中调用 `EndDialogue`。

### 7. 重置对话

使用 `ResetDialogue` 重置对话状态，清除运行时数据。

- **函数**：`ResetDialogue`
  - **调用方式**：
    1. 拖入 `DialogueAsset`，选择 `ResetDialogue`。
    2. 在对话结束或重新开始时调用。

- **示例**：
  ![重置对话](https://example.com/reset_dialogue.png)
  - 在 `EndDialogue` 后调用 `ResetDialogue`。

### 8. 查询节点

使用 `GetNodeById` 和 `GetNextNodes` 查询节点信息。

- **函数**：
  - `GetNodeById`：
    - **输入**：`NodeId`（整数）。
    - **输出**：`UbsDialogueNodeBase` 实例。
  - `GetNextNodes`：
    - **输入**：`NodeId`。
    - **输出**：`TArray<UbsDialogueNodeBase*>`，下一组有效节点。
  - `HasValidNextNodes`：
    - **输入**：`NodeId`。
    - **输出**：布尔值，指示是否有有效后续节点。
  - **调用方式**：
    1. 拖入 `DialogueAsset`，选择函数。
    2. 使用 `NodeId`（通常从 `FDialogueEvent` 的 `NodeId` 获取）。
    3. 分解节点类型（例如 `Cast to UbsDialogueNode` 或 `Cast to UbsChoiceNode`）。

- **示例**：
  ![查询节点](https://example.com/get_node_by_id.png)
  - 在 `NodeEntered` 事件中：
    - 调用 `GetNodeById`，传入 `Event.NodeId`。
    - 转换为 `UbsDialogueNode`，获取 `NodeText`。
    - 转换为 `UbsChoiceNode`，获取 `ChoiceOptions`。

### 9. 验证对话

使用 `ValidateDialogue` 检查对话资产的完整性。

- **函数**：`ValidateDialogue`
  - **输出**：
    - `Return Value`：布尔值，指示验证是否通过。
    - `OutErrors`：字符串数组，包含错误信息。
  - **调用方式**：
    1. 拖入 `DialogueAsset`，选择 `ValidateDialogue`。
    2. 检查 `OutErrors` 数组，显示或记录错误。

- **示例**：
  ![验证对话](https://example.com/validate_dialogue.png)
  - 在对话加载时调用 `ValidateDialogue`。
  - 如果返回 `false`，打印 `OutErrors`。

---

## 关键属性和事件

### 属性

- **DialogueName**（`FText`，只读）：对话名称。
- **DialogueDescription**（`FText`，只读）：对话描述。
- **Nodes**（`TArray<UbsDialogueNodeBase*>`，只读）：对话节点数组，包含 `UbsDialogueNode` 和 `UbsChoiceNode`。
- **CurrentState**（`EDialogueState`，只读）：当前对话状态（如 `Running`, `WaitingForChoice`）。
- **CurrentNodeId**（`int32`，只读）：当前节点 ID。

### 事件

- **OnDialogueEvent**：广播对话事件，结构为 `FDialogueEvent`。
  - 使用 `Switch on EDialogueEventType` 节点处理不同事件。
  - 示例逻辑：
    - `NodeEntered`：更新 UI 显示文本或选项。
    - `ChoiceSelected`：记录玩家选择。
    - `DialogueEnded`：关闭对话 UI。

---

## 示例工作流程

1. **准备对话资产**：
   - 创建 `UUbsDialogue` 资产，配置 `Nodes`：
     - 节点 0（`UbsDialogueNode`）：`NodeText = "你好！"`，`LinkedNodeIds = [1]`。
     - 节点 1（`UbsChoiceNode`）：`ChoiceOptions = ["继续", "结束"]`，`ChoiceLinkedNodeIds = [2, 3]`。
     - 节点 2（`UbsDialogueNode`）：`NodeText = "继续对话。"`。
     - 节点 3（`UbsDialogueNode`）：`NodeText = "再见。"`。

2. **创建 UI 蓝图**：
   - 创建 Widget Blueprint（例如 `WBP_Dialogue`）。
   - 添加文本控件显示 `NodeText`。
   - 添加按钮列表显示 `ChoiceOptions`。
   - 绑定 `OnDialogueEvent` 更新 UI。

3. **集成到游戏**：
   - 在 NPC 蓝图中：
     - 存储 `DialogueAsset` 变量。
     - 在交互事件中调用 `StartDialogue`。
   - 在 `WBP_Dialogue` 中：
     - 监听 `OnDialogueEvent`：
       - `NodeEntered`：检查节点类型，显示 `NodeText` 或 `ChoiceOptions`。
       - `ChoiceSelected`：调用 `AdvanceDialogue` 推进。
     - 为选项按钮绑定点击事件，传入对应的 `ChoiceLinkedNodeIds`。

4. **测试**：
   - 运行游戏，与 NPC 交互。
   - 验证对话流程：显示文本、选项、选择后推进、对话结束。

---

## 调试技巧

1. **日志输出**：
   - 使用 `Print String` 节点打印 `FDialogueEvent` 数据：
     - `EventType`：确认事件触发。
     - `NodeId`：验证当前节点。
     - `EventMessage`：检查错误。
   - 示例：
     ![打印事件](https://example.com/print_dialogue_event.png)

2. **验证对话**：
   - 在加载资产时调用 `ValidateDialogue`。
   - 检查 `OutErrors`，确保没有无效节点或循环链接。

3. **节点检查**：
   - 使用 `GetNodeById` 和 `Cast` 节点验证节点类型。
   - 打印节点属性（如 `NodeText`, `ChoiceOptions`）。

4. **蓝图断点**：
   - 在 `OnDialogueEvent` 处理逻辑中添加断点。
   - 检查 `Event` 结构的字段值。

5. **编辑器日志**：
   - 查看 Output Log 的 `LogTemp` 类别，检查 C++ 代码的错误或警告。
   - 示例：
     ```
     LogTemp: Error: 转换失败：无效节点类型
     ```

---

## 注意事项

1. **对话资产配置**：
   - 确保 `Nodes` 数组包含有效的 `UbsDialogueNode` 和 `UbsChoiceNode` 实例。
   - 检查 `LinkedNodeIds` 和 `ChoiceLinkedNodeIds` 是否指向有效节点。

2. **GameInstance**：
   - `StartDialogue` 需要有效的 `GameInstance`，通过 `Get Game Instance` 获取。
   - 确保游戏模式正确设置 `GameInstance` 类。

3. **UI 同步**：
   - 确保 UI 蓝图实时响应 `OnDialogueEvent`，避免显示过时数据。
   - 使用 `CurrentState` 和 `CurrentNodeId` 同步对话状态。

4. **任务和条件**：
   - 自定义 `UbsDialogueTask` 和 `UbsDialogueCondition` 需要蓝图子类。
   - 确保任务完成时触发 `OnTaskCompleted`，避免对话卡住。

5. **性能**：
   - 对于大型对话（数百个节点），避免频繁调用 `GetNodeById`。
   - 缓存节点引用以提高效率。

6. **本地化**：
   - `NodeText` 和 `ChoiceOptions` 使用 `FText`，支持本地化。
   - 确保 JSON 或资产配置使用本地化键。

---

## 未来扩展

1. **UI 集成**：
   - 开发通用对话 UI 模板，自动处理文本和选项显示。
   - 添加动画和音效支持。

2. **任务和条件**：
   - 创建蓝图库，包含常见任务（例如添加任务、播放动画）和条件（例如检查物品）。
   - 支持异步任务（如定时器）。

3. **编辑器工具**：
   - 开发蓝图工具，允许在编辑器中可视化对话图。
   - 集成 `ValidateDialogue` 到资产创建流程。

4. **多人游戏**：
   - 扩展对话系统，通过 `GameInstance` 或 `ActorComponent` 同步状态。

---

## 总结

`UUbsDialogue` 提供了一个强大的对话系统，通过蓝图可调用函数和事件，开发者可以轻松实现交互式对话。本手册详细说明了如何加载资产、启动对话、处理事件和调试问题。通过示例工作流程和注意事项，开发者可以快速将对话系统集成到游戏中，创建丰富的叙事体验。

如需进一步帮助（如 UI 蓝图示例、自定义任务实现或多人游戏支持），请联系开发团队。