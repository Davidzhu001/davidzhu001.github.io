---
title: 2.Interaction 
date: 2024-12-04 15:32:51
---


# Unreal Engine: Modified Interaction System with Component and Interface

This document provides the modified code for `UUbsInteractComponent` and a new `UInteractableInterface` to support a flexible interaction system integrated with an inventory system, as recommended for combining a component and interface approach.

## 1. Modified UUbsInteractComponent

Below is the updated `UbsInteractComponent.h` and `UbsInteractComponent.cpp` with support for `Interactable Interface`.

### UbsInteractComponent.h
```cpp
#pragma once
#include "CoreMinimal.h"
#include "Components/ActorComponent.h"
#include "UbsInteractComponent.generated.h"

class USphereComponent;
class UUserWidget;
class AUbsCharacterHero;
class UMaterialInterface;
class USoundBase;

DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnInteractSignature, AUbsCharacterHero*, Character);

UCLASS(ClassGroup=(Custom), meta=(BlueprintSpawnableComponent))
class YOURPROJECT_API UUbsInteractComponent : public UActorComponent
{
    GENERATED_BODY()

public:
    UUbsInteractComponent();

    UFUNCTION(BlueprintCallable, Category Kafkaesque::Category = Interaction)
    bool Interact(AUbsCharacterHero* Character);

    UFUNCTION(BlueprintCallable, Category = "Interaction")
    bool CanInteract() const;

    UPROPERTY(BlueprintAssignable, Category = "Interaction")
    FOnInteractSignature OnInteract;

protected:
    virtual void BeginPlay() override;
    virtual void EndPlay(const EEndPlayReason::Type EndPlayReason) override;
    virtual void TickComponent(float DeltaTime, ELevelTick TickType, FActorComponentTickFunction* ThisTickFunction) override;

private:
    UFUNCTION()
    void OnSphereBeginOverlap(UPrimitiveComponent* OverlappedComponent, AActor* OtherActor, UPrimitiveComponent* OtherComp, int32 OtherBodyIndex, bool bFromSweep, const FHitResult& SweepResult);

    UFUNCTION()
    void OnSphereEndOverlap(UPrimitiveComponent* OverlappedComponent, AActor* OtherActor, UPrimitiveComponent* OtherComp, int32 OtherBodyIndex);

    void SetOutlineEnabled(bool bEnabled);
    void TurnOnOutline();
    void TurnOffOutline();
    void UpdateWidgetPosition();

    UPROPERTY(EditAnywhere, Category = "Interaction")
    bool bIsInteractable;

    UPROPERTY(VisibleAnywhere, Category = "Interaction")
    USphereComponent* InteractionSphere;

    UPROPERTY(Transient)
    AUbsCharacterHero* InteractingCharacter;

    UPROPERTY(Transient)
    APlayerController* CachedPlayerController;

    UPROPERTY(Transient)
    bool bIsOutlineActive;

    UPROPERTY(EditAnywhere, Category = "Interaction")
    UMaterialInterface* OutlineMaterial;

    UPROPERTY(EditAnywhere, Category = "Interaction")
    TSubclassOf<UUserWidget> InteractionWidgetClass;

    UPROPERTY(Transient)
    UUserWidget* InteractionWidget;

    UPROPERTY(EditAnywhere, Category = "Interaction")
    USoundBase* PickupSound;
};
```

### UbsInteractComponent.cpp
```cpp
#include "Components/InteractComp/UbsInteractComponent.h"
#include "Blueprint/UserWidget.h"
#include "Character/UbsCharacterHero.h"
#include "Components/SphereComponent.h"
#include "GameFramework/PlayerController.h"
#include "Components/MeshComponent.h"
#include "Components/PrimitiveComponent.h"
#include "Materials/MaterialInterface.h"
#include "Engine/World.h"
#include "Kismet/GameplayStatics.h"
#include "Interfaces/InteractableInterface.h"

UUbsInteractComponent::UUbsInteractComponent()
{
    PrimaryComponentTick.bCanEverTick = false;
    bIsInteractable = true;
    InteractingCharacter = nullptr;
    CachedPlayerController = nullptr;
    bIsOutlineActive = false;

    InteractionSphere = CreateDefaultSubobject<USphereComponent>(TEXT("InteractionSphere"));
    InteractionSphere->SetCollisionProfileName(TEXT("Trigger"));
    InteractionSphere->SetGenerateOverlapEvents(true);
}

void UUbsInteractComponent::BeginPlay()
{
    Super::BeginPlay();

    AActor* Owner = GetOwner();
    if (!Owner)
    {
        UE_LOG(LogTemp, Error, TEXT("UUbsInteractComponent::BeginPlay: Owner is null for %s"), *GetName());
        return;
    }

    if (!InteractionSphere)
    {
        UE_LOG(LogTemp, Error, TEXT("UUbsInteractComponent::BeginPlay: InteractionSphere is null for %s"), *GetName());
        return;
    }

    InteractionSphere->AttachToComponent(Owner->GetRootComponent(), FAttachmentTransformRules::KeepRelativeTransform);

    InteractionSphere->OnComponentBeginOverlap.AddDynamic(this, &UUbsInteractComponent::OnSphereBeginOverlap);
    InteractionSphere->OnComponentEndOverlap.AddDynamic(this, &UUbsInteractComponent::OnSphereEndOverlap);
}

void UUbsInteractComponent::EndPlay(const EEndPlayReason::Type EndPlayReason)
{
    TurnOffOutline();
    InteractingCharacter = nullptr;
    CachedPlayerController = nullptr;

    if (InteractionSphere)
    {
        InteractionSphere->OnComponentBeginOverlap.RemoveAll(this);
        InteractionSphere->OnComponentEndOverlap.RemoveAll(this);
    }

    if (InteractionWidget)
    {
        InteractionWidget->RemoveFromParent();
        InteractionWidget = nullptr;
    }

    Super::EndPlay(EndPlayReason);
    UE_LOG(LogTemp, Log, TEXT("UUbsInteractComponent::EndPlay: %s cleaned up."), GetOwner() ? *GetOwner()->GetName() : TEXT("Unknown Actor"));
}

void UUbsInteractComponent::TickComponent(float DeltaTime, ELevelTick TickType, FActorComponentTickFunction* ThisTickFunction)
{
    Super::TickComponent(DeltaTime, TickType, ThisTickFunction);
    if (bIsOutlineActive && InteractionWidget)
    {
        UpdateWidgetPosition();
    }
}

void UUbsInteractComponent::OnSphereBeginOverlap(UPrimitiveComponent* OverlappedComponent, AActor* OtherActor, UPrimitiveComponent* OtherComp, int32 OtherBodyIndex, bool bFromSweep, const FHitResult& SweepResult)
{
    if (!bIsInteractable) return;

    AUbsCharacterHero* Character = Cast<AUbsCharacterHero>(OtherActor);
    if (Character && InteractingCharacter == nullptr)
    {
        InteractingCharacter = Character;
        CachedPlayerController = Character->GetController<APlayerController>();
        SetOutlineEnabled(true);
        UE_LOG(LogTemp, Log, TEXT("UUbsInteractComponent: Character %s entered interaction range of %s."), *Character->GetName(), *GetOwner()->GetName());
    }
}

void UUbsInteractComponent::OnSphereEndOverlap(UPrimitiveComponent* OverlappedComponent, AActor* OtherActor, UPrimitiveComponent* OtherComp, int32 OtherBodyIndex)
{
    ACharacter* Character = Cast<ACharacter>(OtherActor);
    if (Character && Character == InteractingCharacter)
    {
        InteractingCharacter = nullptr;
        CachedPlayerController = nullptr;
        SetOutlineEnabled(false);
        UE_LOG(LogTemp, Log, TEXT("UUbsInteractComponent: Character %s exited interaction range of %s"), *Character->GetName(), *GetOwner()->GetName());
    }
}

bool UUbsInteractComponent::CanInteract() const
{
    return bIsInteractable && InteractingCharacter != nullptr && CachedPlayerController != nullptr;
}

bool UUbsInteractComponent::Interact(AUbsCharacterHero* Character)
{
    if (!CanInteract() || Character != InteractingCharacter)
    {
        UE_LOG(LogTemp, Warning, TEXT("UUbsInteractComponent::Interact: Cannot interact."));
        return false;
    }

    AActor* Owner = GetOwner();
    if (!Owner)
    {
        UE_LOG(LogTemp, Warning, TEXT("UUbsInteractComponent::Interact: Owner is null."));
        return false;
    }

    // Check if the owner implements Interactable Interface
    if (Owner->Implements<UInteractableInterface>())
    {
        IInteractableInterface::Execute_Interact(Owner, Character);
        UE_LOG(LogTemp, Log, TEXT("UUbsInteractComponent::Interact: Executed interface Interact for %s"), *Owner->GetName());
    }
    else
    {
        OnInteract.Broadcast(Character);
        UE_LOG(LogTemp, Log, TEXT("UUbsInteractComponent::Interact: Broadcasted OnInteract for %s"), *Owner->GetName());
    }

    if (PickupSound)
    {
        UGameplayStatics::PlaySoundAtLocation(GetWorld(), PickupSound, Owner->GetActorLocation());
    }

    UE_LOG(LogTemp, Log, TEXT("UUbsInteractComponent::Interact: Interaction triggered by %s on %s"), *Character->GetName(), *Owner->GetName());
    return true;
}

void UUbsInteractComponent::SetOutlineEnabled(bool bEnabled)
{
    UE_LOG(LogTemp, Log, TEXT("UUbsInteractComponent::SetOutlineEnabled: %s"), bEnabled ? TEXT("Enabled") : TEXT("Disabled"));
    if (bEnabled && !bIsOutlineActive)
    {
        TurnOnOutline();
    }
    else if (!bEnabled && bIsOutlineActive)
    {
        TurnOffOutline();
    }
}

void UUbsInteractComponent::TurnOnOutline()
{
    if (bIsOutlineActive) return;

    AActor* Owner = GetOwner();
    if (!Owner) return;

    TArray<UMeshComponent*> MeshComponents;
    Owner->GetComponents<UMeshComponent>(MeshComponents);

    for (UMeshComponent* Mesh : MeshComponents)
    {
        if (Mesh)
        {
            Mesh->SetOverlayMaterial(OutlineMaterial);
            UE_LOG(LogTemp, Verbose, TEXT("UUbsInteractComponent::TurnOnOutline: Applied overlay material to mesh '%s' on %s"), *Mesh->GetName(), *Owner->GetName());
        }
    }

    if (InteractionWidgetClass && CachedPlayerController && !InteractionWidget)
    {
        InteractionWidget = CreateWidget(CachedPlayerController, InteractionWidgetClass);
        if (InteractionWidget)
        {
            InteractionWidget->AddToViewport();
            UpdateWidgetPosition();
        }
    }

    bIsOutlineActive = true;
    UE_LOG(LogTemp, Log, TEXT("UUbsInteractComponent::TurnOnOutline: Outline enabled for %s. Applied to %d meshes."), *Owner->GetName(), MeshComponents.Num());
}

void UUbsInteractComponent::TurnOffOutline()
{
    if (!bIsOutlineActive) return;

    AActor* Owner = GetOwner();
    if (!Owner) return;

    TArray<UMeshComponent*> MeshComponents;
    Owner->GetComponents<UMeshComponent>(MeshComponents);

    int32 MeshesClearedCount = 0;
    for (UMeshComponent* Mesh : MeshComponents)
    {
        if (Mesh)
        {
            Mesh->SetOverlayMaterial(nullptr);
            MeshesClearedCount++;
            UE_LOG(LogTemp, Verbose, TEXT("UUbsInteractComponent::TurnOffOutline: Removed overlay material from mesh '%s' on %s"), *Mesh->GetName(), *Owner->GetName());
        }
    }

    if (InteractionWidget)
    {
        InteractionWidget->RemoveFromParent();
        InteractionWidget = nullptr;
    }

    bIsOutlineActive = false;
    UE_LOG(LogTemp, Log, TEXT("UUbsInteractComponent::TurnOffOutline: Outline disabled for %s. Cleared from %d meshes."), *Owner->GetName(), MeshesClearedCount);
}

void UUbsInteractComponent::UpdateWidgetPosition()
{
    if (InteractionWidget && CachedPlayerController)
    {
        FVector2D ScreenPosition;
        FVector WorldPosition = GetOwner()->GetActorLocation();
        
        if (UGameplayStatics::ProjectWorldToScreen(CachedPlayerController, WorldPosition, ScreenPosition))
        {
            ScreenPosition.Y -= 100.0f;
            InteractionWidget->SetPositionInViewport(ScreenPosition);
        }
    }
}
```

## 2. New Interactable Interface

Below is the new `InteractableInterface.h` for defining the interaction behavior.

### InteractableInterface.h
```cpp
#pragma once
#include "CoreMinimal.h"
#include "InteractableInterface.generated.h"

class AUbsCharacterHero;

UINTERFACE(MinimalAPI)
class UInteractableInterface : public UInterface
{
    GENERATED_BODY()
};

class IInteractableInterface
{
    GENERATED_BODY()
public:
    UFUNCTION(BlueprintNativeEvent, BlueprintCallable, Category = "Interaction")
    void Interact(AUbsCharacterHero* Character);
};
```

## 3. Example Inventory Component

Below is an example `UInventoryComponent` for managing the inventory.

### InventoryComponent.h
```cpp
#pragma once
#include "CoreMinimal.h"
#include "Components/ActorComponent.h"
#include "InventoryComponent.generated.h"

USTRUCT(BlueprintType)
struct FItem
{
    GENERATED_BODY()
    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    FString ItemName;
    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    int32 Quantity = 1;
};

UCLASS(ClassGroup=(Custom), meta=(BlueprintSpawnableComponent))
class YOURPROJECT_API UInventoryComponent : public UActorComponent
{
    GENERATED_BODY()

public:
    UInventoryComponent();

    UFUNCTION(BlueprintCallable, Category = "Inventory")
    bool AddItem(const FString& ItemName);

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Inventory")
    TArray<FItem> Items;
};
```

### InventoryComponent.cpp
```cpp
#include "Components/InventoryComponent.h"

UInventoryComponent::UInventoryComponent()
{
    PrimaryComponentTick.bCanEverTick = false;
}

bool UInventoryComponent::AddItem(const FString& ItemName)
{
    for (FItem& Item : Items)
    {
        if (Item.ItemName == ItemName)
        {
            Item.Quantity++;
            return true;
        }
    }
    FItem NewItem;
    NewItem.ItemName = ItemName;
    Items.Add(NewItem);
    return true;
}
```

## 4. Example Interactable Item (AApple)

Below is an example of an interactable item (`AApple`) that uses both `UUbsInteractComponent` and `UInteractableInterface`.

### Apple.h
```cpp
#pragma once
#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "InteractableInterface.h"
#include "Apple.generated.h"

class UUbsInteractComponent;
class UStaticMeshComponent;

UCLASS()
class YOURPROJECT_API AApple : public AActor, public IInteractableInterface
{
    GENERATED_BODY()
    
public:
    AApple();

    UFUNCTION(BlueprintNativeEvent, BlueprintCallable, Category = "Interaction")
    void Interact(AUbsCharacterHero* Character);
    virtual void Interact_Implementation(AUbsCharacterHero* Character) override;

protected:
    UPROPERTY(VisibleAnywhere, Category = "Components")
    UUbsInteractComponent* InteractComponent;

    UPROPERTY(EditAnywhere, Category = "Components")
    UStaticMeshComponent* StaticMesh;
};
```

### Apple.cpp
```cpp
#include "Actors/Apple.h"
#include "Components/InteractComp/UbsInteractComponent.h"
#include "Character/UbsCharacterHero.h"
#include "Components/InventoryComponent.h"
#include "Components/StaticMeshComponent.h"

AApple::AApple()
{
    InteractComponent = CreateDefaultSubobject<UUbsInteractComponent>(TEXT("InteractComponent"));
    StaticMesh = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("StaticMesh"));
    SetRootComponent(StaticMesh);
}

void AApple::Interact_Implementation(AUbsCharacterHero* Character)
{
    if (UInventoryComponent* Inventory = Character->FindComponentByClass<UInventoryComponent>())
    {
        Inventory->AddItem("Apple");
        Destroy();
        UE_LOG(LogTemp, Log, TEXT("AApple::Interact: Added Apple to inventory."));
    }
}
```

## 5. Player Interaction Logic

Below is an example of how the player character (`AUbsCharacterHero`) handles interaction input.

### UbsCharacterHero.h (Relevant Part)
```cpp
UFUNCTION(BlueprintCallable, Category = "Interaction")
void Interact();
```

### UbsCharacterHero.cpp (Relevant Part)
```cpp
#include "Character/UbsCharacterHero.h"
#include "Components/InteractComp/UbsInteractComponent.h"
#include "Kismet/GameplayStatics.h"

void AUbsCharacterHero::Interact()
{
    FHitResult HitResult;
    FVector Start = GetActorLocation();
    FVector End = Start + GetActorForwardVector() * 100.0f;
    FCollisionQueryParams Params;
    Params.AddIgnoredActor(this);

    if (GetWorld()->LineTraceSingleByChannel(HitResult, Start, End, ECC_Visibility, Params))
    {
        if (AActor* HitActor = HitResult.GetActor())
        {
            if (UUbsInteractComponent* InteractComp = HitActor->FindComponentByClass<UUbsInteractComponent>())
            {
                InteractComp->Interact(this);
            }
        }
    }
}
```

## 6. Usage in Inventory System
- **Setup**:
  - Attach `UInventoryComponent` to the player character (`AUbsCharacterHero`).
  - Attach `UUbsInteractComponent` to interactable items (e.g., `AApple`).
  - Implement `UInteractableInterface` in item classes to define specific interaction behavior (e.g., adding to inventory).
- **Workflow**:
  1. Player enters the `InteractionSphere` of an item, triggering outline and UI display.
  2. Player presses the interact key (e.g., E), triggering a line trace to find the item.
  3. `UUbsInteractComponent::Interact` checks for `UInteractableInterface` and calls its `Interact` function or broadcasts `OnInteract`.
  4. Item's `Interact` function adds itself to the inventory (via `UInventoryComponent::AddItem`) and destroys itself.