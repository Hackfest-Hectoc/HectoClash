package handler

import (
	"fmt"
	"math"
	"strconv"
	"strings"
)

func MatchingWithQues(expression string, question string) bool {
    // Remove non-numeric characters from expression
    filtered := ""
    for _, char := range expression {
        if char >= '0' && char <= '9' {
            filtered += string(char)
        }
    }
    // Ensure the filtered expression matches the question
    return filtered == question
}

func handleSubmitExpression(expression string, question string) bool {
	if (MatchingWithQues(expression, question)){

		result, err := EvaluateExpression(expression)
		if err != nil {
			fmt.Println("Error:", err)
			return false
		}
		// Allow small floating-point precision errors
		return math.Abs(result-100.0) < 1e-9
	}else{
		return false
	}
}
// Operator precedence mapping
var precedence = map[rune]int{
	'+': 1, '-': 1,
	'*': 2, '/': 2,
	'^': 3,
}

// isOperator checks if a character is an operator
func isOperator(ch rune) bool {
	_, exists := precedence[ch]
	return exists
}

// applyOperator applies an operator to two operands
func applyOperator(a, b float64, op rune) float64 {
	switch op {
	case '+':
		return a + b
	case '-':
		return a - b
	case '*':
		return a * b
	case '/':
		if b == 0 {
			panic("division by zero") // Avoid division by zero
		}
		return a / b
	case '^':
		return math.Pow(a, b)
	}
	return 0
}

// Convert infix to postfix (Shunting Yard Algorithm)
func infixToPostfix(expression string) ([]string, error) {
	var output []string
	var operators []rune

	// Remove spaces
	expression = strings.ReplaceAll(expression, " ", "")
	var numStr string

	for _, ch := range expression {
		if (ch >= '0' && ch <= '9') || ch == '.' {
			numStr += string(ch) // Build number string (supporting decimals)
		} else {
			// If we have a number, add it to output
			if numStr != "" {
				output = append(output, numStr)
				numStr = ""
			}

			if ch == '(' {
				operators = append(operators, ch)
			} else if ch == ')' {
				// Pop from stack until '(' is found
				for len(operators) > 0 && operators[len(operators)-1] != '(' {
					output = append(output, string(operators[len(operators)-1]))
					operators = operators[:len(operators)-1]
				}
				if len(operators) == 0 {
					return nil, fmt.Errorf("mismatched parentheses")
				}
				operators = operators[:len(operators)-1] // Remove '('
			} else if isOperator(ch) {
				// Handle operator precedence
				for len(operators) > 0 && operators[len(operators)-1] != '(' &&
					precedence[operators[len(operators)-1]] >= precedence[ch] {
					output = append(output, string(operators[len(operators)-1]))
					operators = operators[:len(operators)-1]
				}
				operators = append(operators, ch)
			} else {
				return nil, fmt.Errorf("invalid character: %v", string(ch))
			}
		}
	}

	// Push last number
	if numStr != "" {
		output = append(output, numStr)
	}

	// Pop remaining operators
	for len(operators) > 0 {
		if operators[len(operators)-1] == '(' {
			return nil, fmt.Errorf("mismatched parentheses")
		}
		output = append(output, string(operators[len(operators)-1]))
		operators = operators[:len(operators)-1]
	}

	return output, nil
}

// Evaluate postfix expression
func evaluatePostfix(postfix []string) (float64, error) {
	var stack []float64

	for _, token := range postfix {
		if val, err := strconv.ParseFloat(token, 64); err == nil {
			stack = append(stack, val) // Push number
		} else if len(token) == 1 && isOperator(rune(token[0])) {
			// Pop last two values
			if len(stack) < 2 {
				return 0, fmt.Errorf("invalid expression")
			}
			b, a := stack[len(stack)-1], stack[len(stack)-2]
			stack = stack[:len(stack)-2] // Remove last two
			res := applyOperator(a, b, rune(token[0]))
			stack = append(stack, res) // Push result
		} else {
			return 0, fmt.Errorf("invalid token: %s", token)
		}
	}

	// The final result should be on top of the stack
	if len(stack) == 1 {
		return stack[0], nil
	}

	return 0, fmt.Errorf("invalid expression")
}

// EvaluateExpression evaluates an infix mathematical expression and returns a float64 result
func EvaluateExpression(expression string) (float64, error) {
	
	postfix, err := infixToPostfix(expression)
	if err != nil {
		return 0, err
	}
	return evaluatePostfix(postfix)
}

// VerifyExpression checks if the expression evaluates to 100 (floating-point comparison)

