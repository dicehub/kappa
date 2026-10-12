# Adversarial review

Read when reviewing a behavior change or a test deletion batch.

Use a fresh reviewer context. Provide the public specification, the proposed
diff, public tests, and test results. Do not provide the implementer's reasoning,
conversation history, test rework plan, or internal review notes. The reviewer
can inspect the changed code and its callers.

Try to break the change through supported interfaces:

- Find inputs, states, and action sequences that produce the wrong result.
- Check invalid input, error handling, permissions, and untrusted content.
- Check ordering, concurrent work, cancellation, teardown, and resource ownership.
- Look for changed behavior that public tests do not exercise.
- For a test deletion, identify the lost user-facing requirement and a concrete
  fault that the replacement suite would miss.

For each finding, state the affected public interface, the input or sequence,
the expected result, the actual result, and a reproducible public test. Separate
confirmed findings from questions. Do not infer a bug from an implementation
preference or a source-pattern difference alone.

Use the real package, browser, CLI, filesystem, and dependencies. Services outside
our control may be simulated at their network boundary. Do not patch private
methods, inspect private component state, or assert on mocked collaborator calls.

Every confirmed behavior defect gets a public regression test. A private test
requires an approved, small KEEP-LOGIC exception and a stated reason that a public
test cannot protect the obligation. Review does not replace a deterministic test.
