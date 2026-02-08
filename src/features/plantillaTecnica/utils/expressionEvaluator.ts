// src/features/plantillaTecnica/utils/expressionEvaluator.ts

import { TemplateValues } from '../interfaces/template.types'

/**
 * Motor de evaluación de expresiones sin usar eval()
 * Soporta operaciones básicas: +, -, *, /, paréntesis
 * Funciones: min(a,b), max(a,b), round(x,n)
 */

/**
 * Tokeniza una expresión matemática
 */
type Token =
  | { type: 'number'; value: number }
  | { type: 'variable'; name: string }
  | { type: 'operator'; value: string }
  | { type: 'paren'; value: '(' | ')' }
  | { type: 'function'; name: string }
  | { type: 'comma' }

function tokenize(expr: string): Token[] {
  const tokens: Token[] = []
  let i = 0

  while (i < expr.length) {
    const char = expr[i]

    // Espacios en blanco
    if (/\s/.test(char)) {
      i++
      continue
    }

    // Números
    if (/\d/.test(char) || char === '.') {
      let numStr = ''
      while (i < expr.length && (/\d/.test(expr[i]) || expr[i] === '.')) {
        numStr += expr[i]
        i++
      }
      tokens.push({ type: 'number', value: parseFloat(numStr) })
      continue
    }

    // Variables y funciones
    if (/[a-zA-Z_]/.test(char)) {
      let name = ''
      while (i < expr.length && /[a-zA-Z_0-9]/.test(expr[i])) {
        name += expr[i]
        i++
      }

      // Verificar si es una función (seguida de paréntesis)
      const nextNonSpace = expr.slice(i).match(/^\s*\(/)?.[0]
      if (nextNonSpace) {
        tokens.push({ type: 'function', name })
      } else {
        tokens.push({ type: 'variable', name })
      }
      continue
    }

    // Operadores
    if (['+', '-', '*', '/'].includes(char)) {
      tokens.push({ type: 'operator', value: char })
      i++
      continue
    }

    // Paréntesis
    if (char === '(' || char === ')') {
      tokens.push({ type: 'paren', value: char })
      i++
      continue
    }

    // Coma
    if (char === ',') {
      tokens.push({ type: 'comma' })
      i++
      continue
    }

    // Caracter desconocido
    throw new Error(`Caracter desconocido en expresión: "${char}"`)
  }

  return tokens
}

/**
 * Evalúa una expresión con valores dados
 * Retorna el resultado o undefined si:
 * - Hay variables faltantes
 * - El resultado es NaN
 * - El resultado es Infinity
 */
export function evaluateExpression(
  expr: string,
  values: TemplateValues
): number | string | undefined {
  try {
    const tokens = tokenize(expr)
    const result = parseExpression(tokens, 0, values)

    // Si no hay valor, retornar undefined
    if (result.value === undefined || result.value === null) {
      return undefined
    }

    // Si el resultado es NaN o Infinity, retornar undefined
    if (typeof result.value === 'number') {
      if (isNaN(result.value) || !isFinite(result.value)) {
        return undefined
      }
    }

    return result.value
  } catch (error) {
    console.error('Error evaluando expresión:', expr, error)
    return undefined
  }
}

/**
 * Parser recursivo de expresiones
 */
function parseExpression(
  tokens: Token[],
  pos: number,
  values: TemplateValues
): { value: number | undefined; pos: number } {
  return parseAddSub(tokens, pos, values)
}

/**
 * Parsea suma y resta (menor precedencia)
 */
function parseAddSub(
  tokens: Token[],
  pos: number,
  values: TemplateValues
): { value: number | undefined; pos: number } {
  let result = parseMulDiv(tokens, pos, values)
  let { value, pos: currentPos } = result

  while (currentPos < tokens.length) {
    const token = tokens[currentPos]

    if (token.type === 'operator' && (token.value === '+' || token.value === '-')) {
      currentPos++
      const right = parseMulDiv(tokens, currentPos, values)

      if (value === undefined || right.value === undefined) {
        return { value: undefined, pos: right.pos }
      }

      if (token.value === '+') {
        value = value + right.value
      } else {
        value = value - right.value
      }

      currentPos = right.pos
    } else {
      break
    }
  }

  return { value, pos: currentPos }
}

/**
 * Parsea multiplicación y división (mayor precedencia)
 */
function parseMulDiv(
  tokens: Token[],
  pos: number,
  values: TemplateValues
): { value: number | undefined; pos: number } {
  let result = parsePrimary(tokens, pos, values)
  let { value, pos: currentPos } = result

  while (currentPos < tokens.length) {
    const token = tokens[currentPos]

    if (token.type === 'operator' && (token.value === '*' || token.value === '/')) {
      currentPos++
      const right = parsePrimary(tokens, currentPos, values)

      if (value === undefined || right.value === undefined) {
        return { value: undefined, pos: right.pos }
      }

      if (token.value === '*') {
        value = value * right.value
      } else {
        if (right.value === 0) {
          return { value: undefined, pos: right.pos } // División por cero
        }
        value = value / right.value
      }

      currentPos = right.pos
    } else {
      break
    }
  }

  return { value, pos: currentPos }
}

/**
 * Parsea valores primarios: números, variables, funciones, paréntesis
 */
function parsePrimary(
  tokens: Token[],
  pos: number,
  values: TemplateValues
): { value: number | undefined; pos: number } {
  if (pos >= tokens.length) {
    throw new Error('Expresión incompleta')
  }

  const token = tokens[pos]

  // Número literal
  if (token.type === 'number') {
    return { value: token.value, pos: pos + 1 }
  }

  // Variable
  if (token.type === 'variable') {
    const value = values[token.name]
    if (value === undefined || value === null || value === '') {
      return { value: undefined, pos: pos + 1 }
    }
    return { value: Number(value), pos: pos + 1 }
  }

  // Función
  if (token.type === 'function') {
    return parseFunction(tokens, pos, values)
  }

  // Paréntesis
  if (token.type === 'paren' && token.value === '(') {
    const result = parseExpression(tokens, pos + 1, values)
    if (result.pos >= tokens.length) {
      throw new Error('Falta paréntesis de cierre')
    }
    const closeParen = tokens[result.pos]
    if (closeParen.type !== 'paren' || closeParen.value !== ')') {
      throw new Error('Se esperaba paréntesis de cierre')
    }
    return { value: result.value, pos: result.pos + 1 }
  }

  throw new Error(`Token inesperado: ${JSON.stringify(token)}`)
}

/**
 * Parsea llamadas a funciones: min, max, round
 */
function parseFunction(
  tokens: Token[],
  pos: number,
  values: TemplateValues
): { value: number | undefined; pos: number } {
  const funcToken = tokens[pos]
  if (funcToken.type !== 'function') {
    throw new Error('Se esperaba una función')
  }

  const funcName = funcToken.name
  let currentPos = pos + 1

  // Debe seguir un paréntesis
  if (currentPos >= tokens.length || tokens[currentPos].type !== 'paren') {
    throw new Error(`Se esperaba '(' después de ${funcName}`)
  }
  currentPos++ // skip '('

  // Parsear argumentos
  const args: (number | undefined)[] = []

  while (currentPos < tokens.length) {
    const result = parseExpression(tokens, currentPos, values)
    args.push(result.value)
    currentPos = result.pos

    if (currentPos >= tokens.length) {
      throw new Error('Expresión incompleta en función')
    }

    const nextToken = tokens[currentPos]

    if (nextToken.type === 'comma') {
      currentPos++ // skip ','
      continue
    }

    if (nextToken.type === 'paren' && nextToken.value === ')') {
      currentPos++ // skip ')'
      break
    }

    throw new Error(`Token inesperado en función: ${JSON.stringify(nextToken)}`)
  }

  // Evaluar función
  const result = evaluateFunction(funcName, args)
  return { value: result, pos: currentPos }
}

/**
 * Evalúa funciones conocidas
 */
function evaluateFunction(name: string, args: (number | undefined)[]): number | undefined {
  // Si algún argumento es undefined, retornar undefined
  if (args.some(arg => arg === undefined)) {
    return undefined
  }

  const numArgs = args as number[]

  switch (name) {
    case 'min':
      if (numArgs.length !== 2) {
        throw new Error('min() requiere 2 argumentos')
      }
      return Math.min(numArgs[0], numArgs[1])

    case 'max':
      if (numArgs.length !== 2) {
        throw new Error('max() requiere 2 argumentos')
      }
      return Math.max(numArgs[0], numArgs[1])

    case 'round':
      if (numArgs.length < 1 || numArgs.length > 2) {
        throw new Error('round() requiere 1 o 2 argumentos')
      }
      const decimals = numArgs[1] ?? 0
      const factor = Math.pow(10, decimals)
      return Math.round(numArgs[0] * factor) / factor

    default:
      throw new Error(`Función desconocida: ${name}`)
  }
}

/**
 * Extrae todas las variables usadas en una expresión
 */
export function extractVariables(expr: string): string[] {
  try {
    const tokens = tokenize(expr)
    const variables = new Set<string>()

    for (const token of tokens) {
      if (token.type === 'variable') {
        variables.add(token.name)
      }
    }

    return Array.from(variables)
  } catch (error) {
    console.error('Error extrayendo variables:', expr, error)
    return []
  }
}
