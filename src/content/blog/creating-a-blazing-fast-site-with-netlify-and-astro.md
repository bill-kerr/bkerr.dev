---
date: 2023-03-11T05:00:00Z
title: Creating a Blazing Fast Site with Netlify and Astro
preview: As you click around this site, you may notice it's pretty fast. Here are some tricks I used to make it so speedy.
previewImg: /img/blazing-fast.webp
---


<img src="/img/blazing-fast.webp" alt="A man on a bicycle going so fast the background is blurry" class="h-96 object-cover object-middle rounded-lg w-full" height="828" width="640" />

# **Creating a Blazing Fast Site with Netlify and Astro**

I recently converted my personal website (this website) from [HUGO](https://gohugo.io) to [Astro](https://astro.build). There were many reasons, but the main one was that the templating syntax in HUGO just wasn't very good. Additionally, it has very little modern editor support, has no type help, and is just very unwieldy.

The bones of the website stayed the same. I'm serving static HTML with a little [AlpineJS](https://alpinejs.dev) sprinkled on top so I can do things like open the mobile menu. Blog posts like these are written in markdown and then transpiled into HTML at build time. It's all deployed to [Netlify](https://netlify.com) just like before.

I was never thrilled with the speed of the old site--and truth be told, I didn't really care to do much about it. The conversion from HUGO to Astro gave me an opportunity to pursue some speed improvements.

### **Caching**

The first thing I knew I had to do better was caching. The old site would send a request for a new document every time. This is great if you have a frequently updating website, but as you might surmise from the frequency of my blog posts, that just isn't the case for this site.

Netlify has a great CDN that caches pages automatically, but it still requires a trip to their CDN to get the cached version. These requests took about 60 milliseconds on average. That's great--but we can do better. Netlify allows you to modify response headers via a `_headers` file. I started out by setting some `Cache-Control` headers. In the file below, you can see my reasoning for each cache value.

```
# _headers

/
  Cache-Control: private, max-age=900, stale-while-revalidate=31536000

/*
  Cache-Control: private, max-age=900, stale-while-revalidate=31536000

# Cache fonts forever. If the fonts ever change, we will change the filename.
/fonts/*
  Cache-Control: public, max-age=31536000, immutable

# Cache images for an hour. Unlikely a visit will last longer than this.
/img/*
  Cache-Control: public, max-age=3600

# Cache the favicon for a week. This will likely never change and a week is reasonable.
/favicon.svg
  Cache-Control: public, max-age=10080

# Cache CSS forever. When the site builds, the hash changes, so we don't have to worry about this.
/_astro/*.css
  Cache-Control: public, max-age=31536000, immutable

# Cache JS forever. Same reasoning as the CSS above.
/_astro/*.js
  Cache-Control: public, max-age=31536000, immutable
```

These cache settings shaved off those 60 milliseconds for page loads after the first. Awesome! Now, when visiting the site for a second time, my request log looks like this.

![](/img/cached-network-log.webp)

### **Prefetching Pages**

Astro has a great [prefetch addon](https://docs.astro.build/en/guides/integrations-guide/prefetch/) that allows you to just slap `rel="prefetch"` on an anchor tag and it will prefetch the page when the Astro script loads in. I added prefetching to each item in the navigation, so now when you visit any page, it prefetches every major page on the site, adding it to your local browser cache. When you click on a link, you're immediately served a page that's already in your cache.

Similarly, when you visit the [projects](/projects) or [blog](/blog) pages, they prefetch each of their constituent pages. I'll have to make sure the number of projects and blog posts doesn't get too large, but for now this works really well.

### **Image Loading**

There are three steps I took to improve image loading speed.

- I converted all images to `.webp` or `.svg`. These formats have smaller file sizes than `.jpg` or `.png`.
- I set explicit widths and heights on `<img>` tags. This allows the browser to know ahead of time how much space to reserve for an image. It also helps eliminate layout shift.
- I prefetched some images (explained below).

After implementing the image format conversion and setting explicit widths and heights on my images, there was a noticeable increase in the image loading speed. However, I still wasn't happy with how much pop-in could occur when visiting a page with a lot of images (like the [projects page](/projects)).

A good solution would be to prefetch the images before loading the page, but I didn't want to blindly prefetch every image on my site for every page navigation. So, I needed a way to detect a user's _intent_ that they would visit a page. There is a common pattern in web development of prefetching on hover, giving your server/CDN extra precious milliseconds to send back the asset before the user actually clicks. I thought this would be great to implement for images on certain pages.

The problem was that there is no native way to do this with Astro, so I would have to roll my own.

I started by deciding which pages would be good candidates for prefetching images. The [projects](/projects), [blog](/blog), and [resume](/resume) pages were good fits. These all have two or more images and suffered the most from image pop-in.

To detect user intent, I used the `x-on:mouseenter` directive from Alpine.

```html
<a href="/blog" x-on:mouseenter="...">
```

Now, what to put in the event handler? I basically just needed to write some JavaScript that would loop over the images I wanted to prefetch and append `<link rel="prefetch">` tags in the document. If you're not familiar with how Alpine works, you basically just write JavaScript in the string value of an element attribute and Alpine executes it for you. I made a utility function to create this little bit of JavaScript.

```ts
export function createImagePrefetchScript(src: string) {
  const varName = `i${Math.floor(Math.random() * 10000)}`;

	return `if (!prefetched.has("${src}")){` +
			`const ${varName}=document.createElement("link");` +
			`${varName}.rel="prefetch";` +
			`${varName}.href="${src}";` + 
			`${varName}.type="image/webp";` + 
			`$el.appendChild(${varName});` +
			`prefetched.add("${src}");}`;
}
```

Take note of the `prefetched.has(...)` check in the beginning. I wrap the element that I would like to place this script on in another element that has `x-data="{ prefetch: new Set() }"` so that I can keep track of which assets I've already prefetched.

To use it, it's a simple as this.

```html
<div x-data="{ prefetch: new Set() }">
  <a href="/wherever" x-on:mouseenter={createImagePrefetchScript('/img/image-1.webp')}>
</div>
```

Now, on hover, the browser fetches `image-1.webp` before you've even visited the page that uses it. When you do click the link, the image is immediately available from the prefetch cache.

### The Takeaway

Between caching document requests, prefetching pages, and various image loading optimizations, my site went from "ehh" to blazing fast. I've really enjoyed the tools used to build this website and hope you give them all a try.