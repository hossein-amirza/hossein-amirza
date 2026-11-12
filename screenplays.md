---
layout: default
title: "فیلمنامه‌ها"
permalink: /screenplays/
---

<section class="section">
  <div class="container">

    <h1>فیلمنامه‌ها</h1>

    {% for item in site.screenplays %}
      <article>
        <h2><a href="{{ item.url | relative_url }}">{{ item.title }}</a></h2>
        {% if item.excerpt %}<p>{{ item.excerpt | strip_html | truncate: 200 }}</p>{% endif %}
        {% if item.format %}<p><small>{{ item.format }}</small></p>{% endif %}
      </article>
    {% endfor %}

  </div>
</section>
