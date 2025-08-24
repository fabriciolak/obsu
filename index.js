class ObsuMatchers {
	#obsu
	constructor(value, obsu) {
		this.value = value
		this.#obsu = obsu
	}

	toBe(expected) {
		if (this.value !== expected) {
			this.#obsu.reportError(`Expected ${expected}, but received ${this.value}`)
			throw new Error(`Expected ${expected}, but received ${this.value}`)
		}
		return this
	}

	toBeNull() {
		if (this.value !== null) {
			this.#obsu.reportError(`Expected null, but received ${this.value}`)
			throw new Error(`Expected null, but received ${this.value}`)
		}
		return this
	}

	toBeInstanceOf(expected) {
		if (!(this.value instanceof expected)) {
			this.#obsu.reportError(`Expected ${this.value} to be instance of ${expected.name || expected}`)
			throw new Error(`Expected ${this.value} to be instance of ${expected.name || expected}`)
		}
		return this
	}
}

class FunctionMatchers {
	#obsu
	constructor(value, obsu) {
		this.value = value
		this.#obsu = obsu
	}

	toThrow() {
		if (typeof this.value !== 'function') {
			const msg = "Value passed to toThrow is not a function"
			this.#obsu.reportError(msg)
			throw new Error(msg)
		}
		try {
			this.value()
			const msg = "Function did not throw an error as expected"
			this.#obsu.reportError(msg)
			throw new Error(msg)
		} catch {
			// error caught - test passed
		}
		return this
	}
}

class Obsu {
	#results = []
	#currentTest = null

	constructor() {
		setTimeout(() => this.#showResults(), 0)
	}

	expect(value) {
		if (typeof value === "function") {
			return new FunctionMatchers(value, this)
		}
		return new ObsuMatchers(value, this)
	}

	test(description, callback) {
		if (!description) throw new Error("test should have a description")
		if (typeof callback !== "function") throw new Error("test should have a callback function")

		this.#currentTest = {
			status: 'pass',
			description,
			errors: []
		}

		try {
			callback()
		} catch (error) {
			this.#currentTest.status = 'fail'
			if (error.message) this.#addError(error.message)
		}

		this.#results.push(this.#currentTest)
		this.#currentTest = null
	}

	reportError(message) {
		this.#addError(message)
	}

	#addError(message) {
		if (this.#currentTest) {
			this.#currentTest.errors.push(message)
		}
	}

	#showResults() {
		console.log("\nResultados dos testes:")

		const fails = this.#results.filter(r => r.status === 'fail')
		const passes = this.#results.filter(r => r.status === 'pass')

		fails.forEach(result => {
			console.log(`✗ ${result.description}`)
			result.errors.forEach((error, index) => {
				const isLast = index === result.errors.length - 1
				const prefix = isLast ? '└─' : '├─'
				const lines = error.split('\n')

				console.log(`  ${prefix} ${lines[0]}`)
				lines.slice(1).forEach(line => {
					console.log(`  ${isLast ? '  ' : '│ '} ${line}`)
				})
			})
			console.log()
		})

		passes.forEach(result => {
			console.log(`✓ ${result.description}`)
		})

		console.log("\nSummary:")
		console.log(`Total: ${this.#results.length}`)
		console.log(`Passed: ${passes.length}`)
		console.log(`Failed: ${fails.length}`)
	}
}


const obsu = new Obsu()

obsu.test("Sum of two numbers should be equal", () => {
	obsu.expect(1 + 1).toBe(2)
})

obsu.test("1 + 1 should fail", () => {
	obsu.expect(1 + 1).toBe(4)
})

obsu.test("should throw", () => {
	obsu.expect(() => { throw new Error("Erro esperado") }).toThrow()
})

obsu.test("should fail when no error is thrown", () => {
	obsu.expect(() => {}).toThrow()
})

obsu.test("should be null", () => {
	obsu.expect(null).toBeNull()
})

obsu.test("should fail when not null", () => {
	obsu.expect(1).toBeNull()
})

obsu.test("is instance of", () => {
	obsu.expect([]).toBeInstanceOf(Array)
})
