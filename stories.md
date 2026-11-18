---
layout: default
title: داستانک‌ها
permalink: /stories/
---

<div class="container section stories-section">
  <div class="section-heading section-heading-split">
    <div>
      <span class="section-kicker">دفتر داستانک‌ها</span>
      <h2>روایت‌های کوتاه از <em>انسان، تاریخ و لحظه‌های ناگفته</em></h2>
      <p>داستانک‌هایی که در چند خط، جهانی را روایت می‌کنند.</p>
    </div>
    <span class="section-index">۰۱</span>
  </div>

  <p class="stories-intro">
    هر داستانک، پنجره‌ای کوچک به یک لحظه‌ی بزرگ است؛ لحظه‌هایی که در آن‌ها انسان، تاریخ و خیال به هم می‌رسند.
  </p>

  <div class="stories-grid">
    {% for item in site.stories %}
      <a href="{{ item.url | relative_url }}" class="story-card">
        <span class="story-card-number">{{ forloop.index }}</span>
        {% if item.category %}
          <span class="story-card-category">{{ item.category | escape }}</span>
        {% endif %}
        <h3>{{ item.title | escape }}</h3>
        {% if item.excerpt %}
          <p class="story-card-excerpt">{{ item.excerpt | strip_html | truncate: 120 }}</p>
        {% endif %}
        <div class="story-card-footer">
          <span>{% if item.date %}{{ item.date | date: "%Y/%m/%d" }}{% endif %}</span>
          <span>بخوانید ←</span>
        </div>
      </a>
    {% else %}
      <p class="stories-empty">هنوز داستانکی منتشر نشده است.</p>
    {% endfor %}
  </div>
</div>
