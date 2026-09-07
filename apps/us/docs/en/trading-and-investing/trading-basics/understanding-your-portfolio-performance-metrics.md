---
title: Understanding Your Portfolio Performance Metrics
zendesk_article_id: 17163717058063
zendesk_section_id: 15933265134991
zendesk_updated_at: '2026-08-19T08:19:55Z'
zendesk_edited_at: '2026-08-10T05:58:44Z'
source_url: 'https://longbridgeus.zendesk.com/hc/en-us/articles/17163717058063-Understanding-Your-Portfolio-Performance-Metrics'
promoted: true
position: 0
---
Longbridge provides multiple ways to measure your portfolio's performance. This article explains how each metric is calculated and when to use them.

**Cost** **basis — First In, First Out (FIFO)**

All cost basis calculations follow the **First In, First Out (FIFO)** method. Under FIFO, the shares purchased earliest are treated as the first shares sold.

For example, suppose you build a position in XYZ through three separate purchases and later sell 150 shares.

<table class="wysiwyg-table-resized" style="border-collapse: collapse; border-style: none;" data-ace-table-col-widths="213;567"><colgroup><col style="width: 27%;"> <col style="width: 73%;"></colgroup><tbody><tr style="height: 39px;"><td style="border-color: rgb(222, 224, 227); padding: 8px; vertical-align: top;" colspan="1" rowspan="1"><div>Lot 1 — Jan 3</div></td><td style="border-color: rgb(222, 224, 227); padding: 8px; vertical-align: top;" colspan="1" rowspan="1"><div>Buy 100 shares at USD 10.00</div></td></tr><tr style="height: 39px;"><td style="border-color: rgb(222, 224, 227); padding: 8px; vertical-align: top;" colspan="1" rowspan="1"><div>Lot 2 — Feb 7</div></td><td style="border-color: rgb(222, 224, 227); padding: 8px; vertical-align: top;" colspan="1" rowspan="1"><div>Buy 100 shares at USD 14.00</div></td></tr><tr style="height: 39px;"><td style="border-color: rgb(222, 224, 227); padding: 8px; vertical-align: top;" colspan="1" rowspan="1"><div>Lot 3 — Mar 12</div></td><td style="border-color: rgb(222, 224, 227); padding: 8px; vertical-align: top;" colspan="1" rowspan="1"><div>Buy 100 shares at USD 18.00</div></td></tr><tr style="height: 39px;"><td style="border-color: rgb(222, 224, 227); padding: 8px; vertical-align: top;" colspan="1" rowspan="1"><div>Sell — Apr 1</div></td><td style="border-color: rgb(222, 224, 227); padding: 8px; vertical-align: top;" colspan="1" rowspan="1"><div>Sell 150 shares at USD 20.00</div></td></tr></tbody></table>

Under FIFO, all 100 shares from Lot 1 are sold first, and the remaining 50 shares are taken from Lot 2. The cost basis for this sale is (100 × USD 10.00) + (50 × USD 14.00) = **USD 1,700.00**. The remaining 50 shares from Lot 2 and all shares in Lot 3 stay in the portfolio at their original purchase prices.

**Daily P&L cutoff time**

Each day is defined by a cutoff of **20:00 ET**. At that time, Longbridge captures a snapshot of your positions and net asset value to calculate the day's profit and loss (P&L). Asset changes processed after the cutoff are included in the following day's calculations.

**Total P&L**

Total P&L covers both unrealized gains/losses on current holdings and all realized gains/losses.

-   Total P&L = Ending total assets − Beginning total assets − Net asset inflows

We offer two methods for calculating the total P&L rate, which can be selected in the App.

**Simple-weighted return rate**

Under the simple-weighted method, all net cash flows (such as deposits, withdrawals, and stock transfers) during the measurement period are treated as if they occurred at the beginning of the period. These cash flows are combined with the beginning asset value to form the cost basis.

**Cumulative return rate**

Cumulative simple-weighted return rate = Total P&L ÷ (Beginning total assets + Net asset inflows during period)

-   **Advantage:** Fast to calculate, easy to understand.

-   **Limitation:** Less accurate when large asset flows occur mid-period or when the measurement period is long. In extreme cases, the rate may be distorted or show a negative return despite a positive dollar gain.

**Time-weighted return rate**

The time-weighted method divides the measurement period into individual days. A daily return is calculated for each day, and the daily returns are then compounded to produce the cumulative return. This minimizes the distortion caused by cash flows.

Daily return rate = Daily P&L ÷ (Previous day's ending assets + Current day net inflows)

Cumulative time-weighted return rate = \[ (1 + Day 1 rate) × (1 + Day 2 rate) × … × (1 + Day N rate) − 1 \] × 100%

-   **Advantage:** Segments the period day by day, substantially reducing the impact of cash flows on the rate.

-   **Limitation:** Does not account for the size of investments. When deposits or withdrawals are very large relative to the portfolio, the P&L and return rate may have opposite signs. In such cases, the return rate may not provide meaningful insight.

**Realized P&L**

Realized P&L reflects gains and losses realized through completed sell transactions, using FIFO cost basis.

Realized P&L = Σ\[(Sell proceeds per lot − FIFO cost basis per lot) − Fees & commissions\]

For a selected period, cumulative realized P&L is the sum of all realized gains and losses from positions closed during that period.

**Win rate**

Win rate measures the proportion of closed positions that were profitable. A position is counted as a "win" if its total realized P&L across all sell lots is greater than zero.

Win rate = Number of profitable closed positions ÷ Total closed positions × 100%

-   A **closed position** is a position in which all shares of a symbol have been fully sold within the selected period.

-   Partially sold positions are not counted until they are fully closed.

-   If there are no closed positions during the selected period, the win rate is shown as --.
