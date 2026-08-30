# RIVER Project Page

Static project webpage for **"Learning Generalizable Behaviors for Terminal Agents"**
(RIVER: Reward-Integrity Verified Environments for RL).

No frameworks, no build step, no web fonts. Plain HTML + CSS + ~110 lines of vanilla JS.

## Files

- `index.html`: the whole page (hero, TL;DR, problem, insight, recipe, results, analysis, case files, acknowledgments, BibTeX).
- `style.css`: minimal light-theme stylesheet (system font stack, single column, max-width 880px).
- `main.js`: tab switching for Section 8b (false-positive / false-negative rollout traces, with the WAI-ARIA tabs keyboard pattern) and in-page anchor handling that opens closed `<details>` ancestors. Everything else works with JS disabled: without JS, both 8b panels render stacked and all case files remain expandable through native `<details>` controls.
- `static/figures/*.png`: all figure assets.
- `build_inputs/`: source content (`copy.md`, `tables.json`, `cases.json`) the page was built from. Not needed to serve the page.

## Preview locally

```bash
cd webpage
python3 -m http.server 8000
# open http://localhost:8000
```

(Any static file server works; there is nothing to build.)

## TODO before release

Swap the BibTeX entry to `@inproceedings` post-acceptance.

## Anonymization flag (ICLR review period)

Every de-anonymizing element (hero author block, affiliations, and the `author =` line plus the `yao2026river` citation key inside the BibTeX block) carries `class="anon-gated"`. When the flag is on, an `anonymous2026river` citation key (`class="anon-only"`) is shown in its place. To anonymize the page, change one line in `index.html`:

```html
<body>            <!-- non-anonymous arXiv build -->
<body class="anon"> <!-- anonymized ICLR-review build -->
```

The CSS rule `body.anon .anon-gated { display: none; }` hides all gated elements at once. Flip it back by removing the class. (HTML comments next to each gated element in `index.html` repeat this instruction.)

## How the figures were generated

All figure assets in the paper repo are PDF-only. The PNGs in `static/figures/` were rasterized from the canonical PDFs in `fig_folder/` with:

```bash
pdftoppm -png -r 200 <input>.pdf <output-basename>
```

Mapping (PNG ← source PDF):

| PNG | Source PDF |
|---|---|
| `teaser.png` | `illustrations/teaser_figure_v4.pdf` |
| `pipeline.png` | `illustrations/rl-pipeline-v3.pdf` |
| `auc_roc.png` | `illustrations/AUC_ROC-v3.pdf` |
| `env_audit.png` | `appendix_figs/env_audit/Env_Audit.pdf` |
| `qwen35_results.png` | `experiments/3.5series/qwen3.5-results-all-v2.pdf` |
| `verifier_ablation.png` | `experiments/main/perf_looped_verify_5panel-v4.pdf` |
| `correlation_analysis.png` | `experiments/analysis/correlation_analysis-v3.pdf` |
| `sft_coverage.png` | `experiments/analysis/pairs_mean_only_v3.pdf` |
| `behavior_transfer.png` | `experiments/analysis/fig2_behavior_transfer_6feat.pdf` |
| `atomic_coverage.png` | `appendix_figs/appendix_exp/atomic_coverage_3way-paper-v2.pdf` |
