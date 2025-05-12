---
title: 2.Attributes 
date: 2024-12-04 15:32:51
---


# UbsAttributeSet Documentation

## Overview
The `UbsAttributeSet` class defines the character attributes for a *Dream Journey to the West*-inspired RPG built in Unreal Engine using the Gameplay Ability System (GAS). Attributes are categorized into Primary, Secondary, Vital, and Meta attributes, each influencing specific gameplay mechanics such as combat, movement, and progression. The attributes are synchronized with the `UAttributeSetViewModel` for UI display and updated via the `AUbsCharacter::UpdateAttributeViewModel` method.

This document describes each attribute, its purpose, calculation (for secondary attributes), and integration with the game’s systems.

## Attribute Categories

### Primary Attributes
Primary attributes are the core stats that define a character’s base capabilities. They are set directly (e.g., via leveling or equipment) and influence secondary attributes through Gameplay Modifier Magnitude Calculations (MMCs).

| Attribute       | Type  | Description                                                                 | Gameplay Impact                                   |
|-----------------|-------|-----------------------------------------------------------------------------|--------------------------------------------------|
| **Strength**    | float | Represents physical power, affecting life and physical defense.              | Increases `MaxHP`, `Attack`, and `Defense`.       |
| **Agility**     | float | Represents speed and reflexes, affecting movement and evasion.               | Increases `Speed`.                                |
| **Constitution**| float | Represents endurance, affecting life and physical defense.                   | Increases `MaxHP`, `Defense`, and `HPRegen`.      |
| **Intelligence**| float | Represents magical prowess, affecting mana and magical attack.               | Increases `MaxMP`, `MagicalAttack`, and `MPRegen`.|
| **Spirit**      | float | Represents mental fortitude, affecting mana recovery and magical defense.    | Increases `MaxMP`, `MagicalDefense`, `HPRegen`, and `MPRegen`. |

### Secondary Attributes
Secondary attributes are derived from primary attributes via MMCs. They are calculated automatically when primary attributes change and are used in gameplay mechanics like combat and regeneration.

| Attribute          | Type  | Description                                                                 | Calculation Formula                                    | Gameplay Impact                                   |
|--------------------|-------|-----------------------------------------------------------------------------|-------------------------------------------------------|--------------------------------------------------|
| **MaxHP**          | float | Maximum health points, determining how much damage a character can take.    | `(Strength * 5.0 + Constitution * 7.0) + 100`         | Caps `HP`; higher values increase survivability.  |
| **MaxMP**          | float | Maximum mana points, determining how many abilities a character can cast.   | `(Intelligence * 4.0 + Spirit * 6.0) + 100`           | Caps `MP`; higher values allow more ability usage.|
| **Attack**         | float | Physical attack power, affecting damage dealt with physical abilities.      | `Strength * 2.0 + 10`                                 | Increases physical damage output.                |
| **MagicalAttack**  | float | Magical attack power, affecting damage dealt with magical abilities.        | `Intelligence * 2.5 + 10`                             | Increases magical damage output.                 |
| **Defense**        | float | Physical defense, reducing damage taken from physical attacks.              | `(Constitution * 1.5 + Strength * 0.5) + 5`           | Reduces physical damage taken.                   |
| **MagicalDefense** | float | Magical defense, reducing damage taken from magical attacks.                | `Spirit * 2.0 + 5`                                    | Reduces magical damage taken.                    |
| **Speed**          | float | Determines turn order and movement speed in combat.                         | `Agility * 1.5 + 10`                                  | Higher values allow earlier turns and faster movement. |
| **HPRegen**        | float | Health points regenerated per second, aiding passive recovery.              | `(Constitution * 0.2 + Spirit * 0.1) + 1.0`           | Restores `HP` over time, improving survivability. |
| **MPRegen**        | float | Mana points regenerated per second, aiding ability usage.                   | `(Intelligence * 0.15 + Spirit * 0.25) + 1.0`         | Restores `MP` over time, enabling more ability casts. |

**Note**: Formulas are implemented in MMCs (e.g., `UMMC_MaxHP`, `UMMC_HPRegen`). Coefficients and base values are tunable for game balance.

### Vital Attributes
Vital attributes represent the character’s current state and are directly modified during gameplay (e.g., taking damage, casting abilities).

| Attribute | Type  | Description                                                                 | Gameplay Impact                                   |
|-----------|-------|-----------------------------------------------------------------------------|--------------------------------------------------|
| **HP**    | float | Current health points, reduced by damage and restored by healing or regeneration. | If `HP <= 0`, the character dies (`HandleDeath` is called). |
| **MP**    | float | Current mana points, consumed by abilities and restored by regeneration.    | Limits ability usage; if `MP` is low, abilities may be unavailable. |

**Constraints**:
- `HP` is clamped between `0` and `MaxHP`.
- `MP` is clamped between `0` and `MaxMP`.

### Meta Attributes
Meta attributes are temporary values used to track incoming effects, processed by Gameplay Effects.

| Attribute         | Type  | Description                                                                 | Gameplay Impact                                   |
|-------------------|-------|-----------------------------------------------------------------------------|--------------------------------------------------|
| **IncomingDamage**| float | Tracks damage to be applied to `HP`, modified by defenses.                  | Reduces `HP` after applying `Defense` or `MagicalDefense`. |
| **IncomingXP**    | float | Tracks experience points to be awarded, contributing to leveling.           | Increases character level or progression.        |

## Attribute Integration

### UbsAttributeSet
- **Class**: `UUbsAttributeSet` (inherits from `UAttributeSet`).
- **Purpose**: Manages character attributes using GAS, handling replication, clamping, and updates.
- **Key Functions**:
  - `PreAttributeChange`: Clamps `HP` and `MP` to their respective maximums.
  - `PostAttributeChange`: Updates `UAttributeSetViewModel` via `AUbsCharacter::UpdateAttributeViewModel` and handles `MaxHP`/`MaxMP` top-off logic.
  - `OnRep_*`: Replication callbacks for each attribute to notify clients of changes.
- **Replication**: All attributes except `IncomingDamage` and `IncomingXP` are replicated with `REPNOTIFY_Always`.

### UAttributeSetViewModel
- **Class**: `UAttributeSetViewModel` (inherits from `UMVVMViewModelBase`).
- **Purpose**: Exposes `UbsAttributeSet` attributes for UI binding, enabling real-time display in UMG widgets.
- **Key Features**:
  - Attributes are marked with `FieldNotify` for MVVM binding.
  - Setters use `UE_MVVM_SET_PROPERTY_VALUE` to notify UI of changes.
  - `HP`, `MaxHP`, `MP`, and `MaxMP` are `int32` (rounded from `float` in `UbsAttributeSet`) for UI simplicity.
  - Utility functions `GetHPPercent` and `GetMPPercent` calculate health/mana percentages for progress bars.
- **Attribute Mapping**:
  - Maps directly to `UbsAttributeSet` attributes, with `HPRegen` and `MPRegen` replacing `HealthRegeneration` and `ManaRegeneration`.
  - Removed attributes like `Armor` and `FireResistance` to align with `UbsAttributeSet`.

### AUbsCharacter::UpdateAttributeViewModel
- **Method**: `void AUbsCharacter::UpdateAttributeViewModel(const FString NameString, float NewValue)`
- **Purpose**: Updates `UAttributeSetViewModel` when `UbsAttributeSet` attributes change, called from `UbsAttributeSet::PostAttributeChange`.
- **Key Logic**:
  - Checks if `AttributeSetViewModel` is initialized.
  - Maps `NameString` to the corresponding `UAttributeSetViewModel` setter (e.g., `"HP"` to `SetHP`).
  - Casts `NewValue` to `int32` for `HP`, `MaxHP`, `MP`, and `MaxMP`.
  - Triggers `HandleDeath` if `HP <= 0` and the character is not already dead.
  - Logs warnings for unknown attributes or errors for uninitialized ViewModel.

## Gameplay Mechanics
- **Combat**:
  - Physical damage is calculated using `Attack` and reduced by `Defense`.
  - Magical damage uses `MagicalAttack` and is reduced by `MagicalDefense`.
  - `Speed` determines turn order in combat.
- **Regeneration**:
  - `HPRegen` and `MPRegen` restore `HP` and `MP` per second, implemented via Gameplay Effects (not yet defined).
- **Progression**:
  - `IncomingXP` contributes to leveling, which may increase primary attributes.
- **Death**:
  - When `HP <= 0`, `HandleDeath` is called (implementation pending), likely disabling the character or triggering a respawn.

## Implementation Details
- **MMCs**: Secondary attributes are calculated using MMCs (e.g., `UMMC_MaxHP`, `UMMC_HPRegen`) in Gameplay Effects. Each MMC captures relevant primary attributes using `FGameplayEffectAttributeCaptureDefinition` and computes the value with `FAggregatorEvaluateParameters`.
- **UI Binding**: `UAttributeSetViewModel` uses MVVM to bind attributes to UMG widgets. For example, `HP` and `MaxHP` drive a health bar via `GetHPPercent`.
- **Networking**: Attributes are replicated to ensure multiplayer consistency, with `OnRep_*` callbacks notifying clients of changes.
- **Tuning**: Formulas (e.g., `MaxHP = (Strength * 5.0 + Constitution * 7.0) + 100`) are placeholders inspired by *Dream Journey to the West*. Adjust coefficients and base values for balance.

## Future Considerations
- **Additional Attributes**: Consider adding attributes like `CriticalHitChance` or elemental resistances if needed for gameplay depth.
- **Regeneration System**: Implement Gameplay Effects to apply `HPRegen` and `MPRegen` periodically (e.g., every second).
- **Leveling System**: Define how `IncomingXP` affects primary attribute growth.
- **UI Enhancements**: Add animations or effects to the UI when attributes like `HP` or `MP` change significantly.
- **Balance Testing**: Test attribute scaling to ensure combat feels fair and progression is rewarding.

## Example Usage
1. **Attribute Update**:
   - A Gameplay Effect increases `Strength` by 10.
   - `UbsAttributeSet::PreAttributeChange` validates the new value.
   - `UbsAttributeSet::PostAttributeChange` calls `AUbsCharacter::UpdateAttributeViewModel("Strength", 10.0f)`.
   - `UpdateAttributeViewModel` calls `UAttributeSetViewModel::SetStrength(10.0f)`, updating the UI.
2. **Combat**:
   - An enemy deals 50 damage via `IncomingDamage`.
   - A Gameplay Effect reduces damage by `Defense` (e.g., 10), applying 40 to `HP`.
   - `HP` drops, triggering `UpdateAttributeViewModel("HP", NewHP)`, updating the health bar.
3. **Regeneration**:
   - A Gameplay Effect applies `HPRegen` (e.g., 2.0 per second) to `HP`.
   - `UpdateAttributeViewModel("HP", NewHP)` updates the UI health bar.

## References
- **Source Files**:
  - `UbsAttributeSet.h/cpp`: Defines attributes and GAS integration.
  - `AttributeSetViewModel.h/cpp`: Exposes attributes for UI binding.
  - `UbsCharacter.cpp`: Contains `UpdateAttributeViewModel`.
  - MMCs (e.g., `UMMC_MaxHP.h/cpp`, `UMMC_HPRegen.h/cpp`): Calculate secondary attributes.
- **Unreal Engine GAS**: [Gameplay Ability System Documentation](https://docs.unrealengine.com/en-US/gameplay-ability-system-in-unreal-engine/)
- **MVVM**: [Unreal Engine MVVM Documentation](https://docs.unrealengine.com/en-US/mvvm-in-unreal-engine/)

For further details or to request additional attributes, contact the development team.