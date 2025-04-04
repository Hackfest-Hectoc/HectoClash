package handler

import (
	"fmt"
	"github.com/Knetic/govaluate"
)

func VerifyExpression(expression string) bool {
	eval, err := govaluate.NewEvaluableExpression(expression)
	if err != nil {
		fmt.Println("Invalid expression:", err)
		return false
	}

	result, err := eval.Evaluate(nil)
	if err != nil {
		fmt.Println("Evaluation error:", err)
		return false
	}

	// Convert result to float64 and check if it's equal to 100
	if value, ok := result.(float64); ok && value == 100 {
		return true
	}

	return false
}
