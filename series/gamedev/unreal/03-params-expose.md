## UPROPERTY Specifiers Cheat Sheet

在 Unreal Engine 中，`UPROPERTY` 是用于声明类成员变量的宏，提供了许多 specifiers 来控制属性的行为和编辑器中的可见性。以下是一些常用的 specifiers：

### 常见 Specifiers

- **VisibleAnywhere**: 属性在任何地方可见，但不可编辑。
- **VisibleInstanceOnly**: 属性仅在实例中可见，但不可编辑。
- **VisibleDefaultsOnly**: 属性仅在默认对象中可见，但不可编辑。
- **EditAnywhere**: 属性在任何地方可编辑。
- **EditInstanceOnly**: 属性仅在实例中可编辑。
- **EditDefaultsOnly**: 属性仅在默认对象中可编辑。

### 访问 Specifiers

- **BlueprintReadOnly**: 允许蓝图读取，但不能编辑。
- **BlueprintReadWrite**: 允许蓝图读取和编辑。

### 网络复制 Specifiers

- **Replicated**: 属性将在网络上自动复制。
- **ReplicatedUsing**: 使用指定的函数进行复制通知。