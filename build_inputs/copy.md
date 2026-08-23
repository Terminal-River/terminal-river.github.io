# RIVER Project Page: Final Copy (build input)

> Build note (style mandate from the authors): simple and clear, NOT fancy. Single-column academic project page. No frameworks, no build step, no web fonts (system font stack). Minimal JS with tabs and expandables only; prefer native `<details>/<summary>`. Light theme. Clarity over decoration.
> This is the non-anonymous arXiv build (`ANON` flag off): author block, affiliations, correspondence email, and BibTeX author list are all shown.

---

## HERO

**Title:** Learning Generalizable Behaviors for Terminal Agents

**Tagline (under title):**
1. How Does RL Help Terminal Agents Generalize?
2. Can Your Synthetic Terminal Environments Be Trusted for RL?

**Authors:** [Yihang Yao](https://yihangyao.github.io)†¹˒², [Bo Pang](https://www.salesforce.com/blog/author/bo-pang/)†¹, [Xuan Phi Nguyen](https://nxphi47.github.io/)¹, [Ding Zhao](https://safeai-lab.github.io/)², [Shafiq Joty](https://raihanjoty.github.io/)¹, [Semih Yavuz](https://www.salesforce.com/blog/author/semih-yavuz/)¹

**Affiliations:** ¹Salesforce AI Research · ²Carnegie Mellon University · †Core contributors

**Venue line:** arXiv preprint

**Stat strip (2 tiles):**
1. **<30%** of the TMax environments used
2. **+106% / +30%** larger average RL gains on TB-Lite / TB-v2.1

**Gallery teaser chip:**
Case Examples: Reward Exploits and Verifier Failures →

**Hero figure caption** (`teaser_figure_v4`):
The [**Agentic Compositional Generalization**](#insight) hypothesis: SFT supplies atomic skills, while RL learns how to compose and route them. This suggests a practical recipe: broaden skill coverage before RL, then improve verifier quality so RL reinforces reusable behaviors.

---

## TLDR

Terminal-agent RL is often treated as an environment-scaling problem. Our results point to another important factor: **the quality of the reward signal**. The [agentic compositional generalization hypothesis](#insight) proposes that SFT and pre-training primarily supply atomic skills, while RL shapes reusable (multi-turn) behaviors that compose and route them.

That division of labor guides RIVER. First broaden skill coverage; then filter defective environments and shape the reward so RL reinforces transferable behaviors. Using fewer than 30% of the TMax environments, River-8B leads the evaluated open-source RL-trained 8B models across four terminal benchmarks, while the same filtering recipe improves RL gains across models from 2B to 27B.

---

## PROBLEM

**Section heading:** The Problem: When Verifiers Give the Wrong Signal

Terminal-agent RL has a simple loop: the model acts in an executable environment, and a verifier decides whether the result deserves reward. Synthetic environments make that loop scalable when real interaction data are scarce. But scaling the collection does not by itself ensure that the reward reflects the task.

Our audit found substantial noise in public environment collections. Only 35.8% of TMax environments were labeled Clean; TermiGen and TerminalTraj-5k had even lower clean rates. Some defects reward shortcuts. Others reject valid solutions. In both cases, the agent learns from the wrong signal.

So the central question is not just how many environments we can generate. It is what RL learns from them, and whether their rewards can be trusted.

**Micro-teaser link:** Watch an agent copy a leaked answer file for reward 1.0 while a correct solution gets reward 0. [See the case files →](#casefiles)

**Figure caption** (`Env_Audit`):
Clean environments are the minority across all three audited collections.

---

## INSIGHT

**Section heading:** The Hypothesis: RL Shapes How Agents Act

Our **agentic compositional generalization** hypothesis proposes that pre-training and SFT supply low-level skills, while RL primarily shapes reusable, multi-turn behaviors that decide when and how to deploy them. This account may help explain why training on a narrow set of domains can still transfer to new ones.

**Definition cards (two columns):**
- **Skill:** a property of an *individual action*. Can the agent write the regex, call the API, or use the tool correctly?
- **Behavior:** a property of an *action sequence*. Does the agent inspect first, recover from errors, verify its work, and avoid loops?

The evidence is striking. Behavior features predict trajectory success with an AUC of 0.74, while skill features remain near chance at roughly 0.55. The behavior–success relationship also becomes stronger after RL. Knowing *how* an agent acts tells us more than knowing which skills appear in its trajectory.

**Supporting figure** (`AUC_ROC-v3`, collapsible):
For reference, an AUC of 0.5 corresponds to chance-level discrimination, while 1.0 represents perfect discrimination. Behavior features reach 0.74 after RL; skill features remain near chance at roughly 0.55.

**Pull-quote (takeaway box):**
> "Task success is associated more with how the agent behaves than which skills a trajectory uses."

**Figure caption** (teaser right panel, reused):
SFT instills skills; RL shapes the behaviors that compose them.

---

## RECIPE

**Section heading:** The Recipe: Improving the Reward Signal

The hypothesis gives us a practical design rule: cover missing skills before RL, then run RL with trustworthy rewards that reinforce reusable behaviors. RIVER turns that rule into four steps; environment filtering and verifier enhancement are the core.

1. **Start with broad-coverage SFT (optional).** Give weaker models a diverse base of atomic skills.
2. **Filter the environments** *(RIVER core)*. An LLM rubric audit flags defective tasks, then an oracle pass@2 check removes tasks that oracle agents cannot solve.
3. **Enhance the verifier** *(RIVER core)*. A lightweight turn-level signal penalizes repetitive loops.
4. **Run GRPO RL** on the resulting **RIVER-TMax-3.5K** collection.

**Headline number:** 14,399 TMax environments in → 3.5K kept (<30%).

**Reward-integrity framing line:**
Filtering protects both sides of the reward: it removes tasks that reward shortcuts and tasks that reject correct work.

**Audit-reliability callout: "Can you trust an LLM audit?"**
As a cross-check, Claude Opus 4.8 independently re-judged 120 GPT-5.4 verdicts. Clean-vs-defective agreement was 83.3%, and 90% of defect flags were confirmed. Clean verdicts were less reliable, so the retained set is not guaranteed to be perfect. The audit is most useful as a reliable removal filter.

**Expandable: the 8 audit verdicts** (each available defect verdict links to its matching case study in the case files):
- **Clean:** task, environment, and verifier are consistent; no defect found.
- **Verifier-Too-Weak:** the checks are so loose that non-solutions pass. → case files
- **Instr-Verifier-Mismatch:** the verifier tests something different from what the instruction asks. → case files
- **Instr-Env-Mismatch:** the environment doesn't contain what the instruction assumes. → case files
- **Answer-Leak:** the answer the verifier checks for is sitting in the environment. → case files
- **Instr-Ambiguous:** the instruction admits multiple reasonable readings that the verifier doesn't accept.
- **Task-Trivial:** the task can be passed with no meaningful work.
- **Other:** defects outside the categories above.

**Figure caption** (`rl-pipeline-v3`):
RIVER filters the training environments, strengthens the reward signal, and then runs RL on the curated collection.

---

## RESULTS

**Section heading:** Results: Better Signals Improve Performance

**6a. RL-trained 8B models.**
Among the evaluated open-source RL-trained 8B models, River-8B ranks first on all four benchmarks. It reaches an average score of **19.4**, compared with 17.8 for the strongest baseline.
**Table caption** (leaderboard, from `leaderboard_8B.tex`):
Performance of evaluated RL-trained 8B models on four terminal-agent benchmarks (scores ×10², mean ± std over 3 seeds). River-8B leads all four in this comparison. Show only models trained with RL; omit SFT-only and base-model rows.

**6b. Less data, larger RL gains.**
We keep the base models, TMax training pipeline, harness, and DPPO objective fixed, aside from minor infrastructure differences. Replacing the full environment set with RIVER's filtered <30% subset produces, on average, **106% larger RL gains** on Terminal-Bench-Lite and **30% larger gains** on Terminal-Bench-v2.1.

**Figure caption** (`qwen3.5-results-all-v2`):
Across 2B–27B models, the filtered subset delivers larger RL gains than the full TMax collection.

**6c. Not every correlated signal improves performance.**
Both shaping signals change the targeted behavior, but in this ablation only the turn-wise repetition penalty improves overall performance. Rewarding verification increases verification without improving results. Correlation alone is not enough.

**Figure caption** (`perf_looped_verify_5panel-v4`):
Penalizing repetitive loops helps; directly rewarding verification does not.

**6d. Filtering has a measurable payoff.**
With the same budget of 3.5K environments, the integrity-filtered set scores **19.4** on average, compared with **17.7** for a random TMax subset.

| Training set | Avg |
|---|---|
| River-8B (RIVER-TMax-3.5K) | **19.4** |
| RL on random TMax-3.5K | 17.7 |
| SFT only | 12.5 |

The 1.7-point gap is not abstract. [The case files](#casefiles) show how defective rewards teach shortcuts or punish correct behavior.

**Generalization claim line:**
Taken together, the recipe holds across model families, scales from 2B to 27B, agent harnesses, and RL objectives.

---

## ANALYSIS

**Section heading:** What Changes During RL: Skills Stay, Behaviors Move

**1. The skills stay; the routing changes.**
Skill usage remains strongly correlated before and after RL, and skill co-occurrence is largely preserved (RSA ρ = 0.83). The mapping from tasks to skills changes more substantially (ρ = 0.27). These patterns are consistent with RL reorganizing *when* existing skills are used rather than building a new skill inventory.

**Figure caption** (`correlation_analysis-v3`):
Skill use stays stable, while task-to-skill routing changes after RL.

**2. Behaviors transfer across domains.**
In our controlled experiment, RL training on only 2 of 8 domains still improves held-out performance, and similar behavior shifts appear in domains excluded from training.

**Figure caption** (`fig2_behavior_transfer_6feat`):
Behavior shifts observed after training on two domains also appear in the six held-out domains.

**3. SFT skill coverage gates RL gains.**
Narrow and diverse SFT checkpoints look similar before RL. After RL, the model with broader atomic-skill coverage pulls ahead. These results suggest that broader SFT coverage provides a stronger starting point, consistent with RL being inefficient at acquiring missing atomic skills.

**Figure caption** (`pairs_mean_only_v3`):
Broader SFT skill coverage creates a stronger starting point for RL.

**Supporting figure caption** (`atomic_coverage_3way-paper-v2`, collapsible):
Atomic-skill coverage comparison across SFT data configurations.

---

## CASEFILES

**Section heading:** Reward Integrity in Practice: The Case Files

**Opening frame:**
Bad verifiers fail in two directions: they reward shortcuts and reject correct work. The first set of cases shows what RIVER catches before training. The second shows what happens when corrupted rewards reach the rollout.

**Source:** All cases are drawn from the [TMax-15K collection](https://huggingface.co/datasets/allenai/TMax-15K).

### 8a. Caught before training

Four representative audit findings. Expand any case for the task, failure, and key evidence. The paper includes additional audit cases.

### 8b. What corrupted rewards teach

These rollout traces show the moment a shortcut is rewarded or a correct solution is rejected. Expand a case to follow the interaction turn by turn.

**Tab: False-positive: reward = 1 for cheating.**
Cases are numbered 1–5 in display order. The two priority cases appear first without a special label.

**Tab: False-negative: reward = 0 for being right.**
Cases are numbered 1–5 in display order. The two priority cases appear first without a special label.

**Takeaway strip:**
False positives can reinforce shortcuts; false negatives can punish correct behavior. With the same 3.5K-environment budget, RIVER scores **19.4** compared with **17.7** for a random TMax subset. This comparison suggests that reward integrity matters for RL training.

---

## ACKNOWLEDGMENTS

Our audit identifies issues in some TMax environments, but the collection remains an important contribution to the community. We are grateful to the TMax authors for releasing a resource that has enabled this study and supports broader research on terminal-agent RL.

---

## BIBTEX

```bibtex
@misc{yao2026river,
  title  = {Learning Generalizable Behaviors for Terminal Agents},
  author = {Yao, Yihang and Pang, Bo and Nguyen, Xuan Phi and Zhao, Ding and Joty, Shafiq and Yavuz, Semih},
  year   = {2026},
  note   = {arXiv preprint (link TBD)}
}
```

(Swap to `@inproceedings` post-acceptance.)
