
#01-  **3BLUE1BROWN VIDEO SUMMARY NOTES:**
# Deep Learning Study Notes: Gradient Descent & Neural Network Learning

## 1. Network Setup (The MNIST Problem)

The task is handwritten digit classification (0–9) using the standard MNIST dataset.

  

```
[Input Layer]          [Hidden Layer 1]       [Hidden Layer 2]         [Output Layer]
 784 Neurons  ───────►   16 Neurons   ───────►   16 Neurons   ───────►   10 Neurons
(28x28 Pixels)                                                         (Digits 0-9)
```

- **Inputs:** Each $28 \times 28$ grayscale pixel has an activation between $0.0$ (black) and $1.0$ (white), yielding **784 input neurons**

- **Connections & Activations:** Every neuron computes a weighted sum of all inputs from the preceding layer plus a bias, squashed via an activation function (e.g., Sigmoid or ReLU):
      
    
    $$a^{(l)} = \sigma\left(\sum w_{jk} a^{(l-1)}_k + b\right)$$
    
- **Parameters:** In this $784 \to 16 \to 16 \to 10$ architecture:
    
      
    
    $$(784 \times 16 + 16) + (16 \times 16 + 16) + (16 \times 10 + 10) \approx 13{,}000 \text{ weights and biases}$$
    
- **Decision Rule:** The predicted digit corresponds to whichever of the 10 output neurons fires with the highest activation.
    
      
    

## 2. The Cost Function (Quantifying Error)

When parameters are randomly initialized, the output is essentially noise. To guide learning, we define a scalar **Cost Function** $C$ that measures overall inaccuracy across training examples.

  

- **Single Example Cost (Mean Squared Error style):**
    
      
    
    $$C_k = \sum_{j=0}^{9} (a_j - y_j)^2$$
    
    - $a_j$: The network's actual activation for output neuron $j$.
        
          
        
    - $y_j$: The ground-truth target ($1.0$ for the correct digit class, $0.0$ for all others).
        
          
        
- **Total Cost Function:**
    
      
    
    $$C(W, b) = \frac{1}{N} \sum_{k=1}^N C_k$$
    
    The function takes all $\sim 13{,}000$ weights and biases as inputs and compresses the network's total error across tens of thousands of images into a single number.
    
      
    

> **Core Takeaway:** Learning does not require human-like intuition. It is purely a multivariable calculus optimization problem: **find the parameter vector $(W, b)$ that minimizes $C(W, b)$.**
> 
>   

## 3. Optimization via Gradient Descent

Because the cost function has thousands of parameters, finding the minimum analytically ($\nabla C = 0$) is intractable. We instead find it iteratively using **Gradient Descent**.

  

### Step-by-Step Mechanics

```
               Slope > 0
               (Step Left ◄──)
       \                     /  Slope < 0
        \                   /   (──► Step Right)
         \     Valley      /
          \  (Minimum)    /
           \____ • _____/
```

1. **In 1D Space:**
    
      
    - Evaluate the derivative (slope) $\frac{dC}{dw}$ at the current position.
        
          
        
    - If slope is **positive**, step **left** (decrease $w$).
        
          
        
    - If slope is **negative**, step **right** (increase $w$).
        
          
        
    - Step size is scaled by the magnitude of the slope, naturally shrinking as the valley flattens.
        
          
        
2. **In Multivariable ($N$-Dimensional) Space:**
    
      
    - **Gradient Vector ($\nabla C$):** Points in the direction of **steepest ascent** (maximum increase in cost).
        
          
        
    - **Negative Gradient ($-\nabla C$):** Points in the direction of **steepest descent** (maximum reduction in cost).
        
          
        
    - **Parameter Update Rule:**
        
          
        
        $$\theta_{\text{new}} = \theta_{\text{old}} - \eta \nabla C$$
        
        where $\eta$ is the learning rate and $\theta$ represents all weights and biases.
        
          
        
3. **Dual Interpretation of $-\nabla C$:**
    
      
    - **Geometric:** An arrow pointing downhill in a 13,000-dimensional landscape.
        
          
        
    - **Sensitivity / Relative Importance:** Each entry's magnitude indicates which specific weight or bias provides the biggest reduction in cost per unit nudge ("bang for your buck").
        
          
        
4. **Continuous Activations Matter:** Neurons output continuous values rather than binary $0/1$ outputs so the cost function remains smooth and differentiable, enabling step-by-step gradient descent.
    
      
    
5. **Backpropagation:** The algorithmic technique used to efficiently calculate this massive gradient across all layers.
    
      
    

## 4. What the Network Actually Learns

|**Ideal Conceptual Hypothesis**|**Empirical Reality**|
|---|---|
|**Layer 2:** Detects crisp, local edges and stroke components.|**Layer 2:** Visualized weights appear as noisy, diffuse pixel patterns with faint central clusters.|
|**Layer 3:** Assembles edges into loops, curves, and angles.|**Layer 3:** Continues abstract, non-obvious statistical combinations.|
|**Layer 4:** Combines high-level geometric features to recognize digits.|**Layer 4:** Classifies centered MNIST images accurately (~96%), but lacks general geometric reasoning.|

### Failure Mode on Noise

Because the network is trained solely to separate centered digits, feeding pure random noise yields high-confidence classifications (e.g., 90%+ confidence that uniform static is a "5"). The network learns a decision boundary for its specific data distribution, not an understanding of what digits look like.

  

## 5. Memorization vs. True Generalization

Experiments with deep networks highlight how gradient descent navigates structured versus random data:

  

- **Shuffled Label Experiment:** If training labels are randomly shuffled, deep networks with millions of parameters can still reach near 100% training accuracy through brute-force parameter memorization.
    
      
    
- **Loss Dynamics Difference:**
    
      
    - **Randomized Data:** Loss drops slowly and linearly; gradient descent struggles through a difficult optimization landscape.
        
          
        
    - **Structured Data:** The cost drops rapidly following initial steps. The natural geometric structure in real data creates smoother, more accessible downhill paths toward high-performing local minima.
        

## 6. High-Level Summary Cheat Sheet

| **Concept**               | **Definition / Role**                                                                                                                 |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **MNIST Input**           | 784 pixels ($28 \times 28$) fed as values between 0 and 1.                                                                            |
| **Cost Function**         | Measures average squared error between actual activations and one-hot target vectors.                                                 |
| **Gradient ($\nabla C$)** | Vector indicating the direction of fastest cost increase; its magnitude reflects slope steepness.                                     |
| **Gradient Descent**      | Iteratively nudging parameters in the direction of $-\nabla C$ to reach a low-cost local minimum.                                     |
| **Backpropagation**       | An efficient algorithm to compute the partial derivatives of $C$ with respect to every weight and bias.                               |
| **Performance**           | ~96% test accuracy on raw MNIST using standard MLP; weights reflect statistical correlations rather than clean human stroke patterns. |
[[GRADIENT DESCENT]]