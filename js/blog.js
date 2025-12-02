// Blog functionality
document.addEventListener('DOMContentLoaded', () => {
    const blogListContainer = document.getElementById('blog-list');
    const blogPostContainer = document.getElementById('blog-post');

    if (blogListContainer) {
        loadBlogList();
    }

    if (blogPostContainer) {
        loadBlogPost();
    }
});

async function loadBlogList() {
    try {
        const response = await fetch('/posts/index.json');
        if (!response.ok) throw new Error('Failed to load posts index');

        const posts = await response.json();
        const blogListContainer = document.getElementById('blog-list');

        if (posts.length === 0) {
            blogListContainer.innerHTML = '<p>No posts found.</p>';
            return;
        }

        const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

        blogListContainer.innerHTML = posts.map(post => {
            const postLink = isLocal ? `/blog/post.html?slug=${post.slug}` : `/blog/${post.slug}.html`;
            return `
            <article class="blog-card">
                ${post.cover ? `<div class="blog-card-image"><img src="${post.cover}" alt="${post.title}"></div>` : ''}
                <div class="blog-card-content">
                    <div class="blog-meta">
                        <span class="date">${formatDate(post.date)}</span>
                        ${post.tags ? `<span class="tags">${post.tags.join(', ')}</span>` : ''}
                    </div>
                    <h3><a href="${postLink}">${post.title}</a></h3>
                    <p>${post.description}</p>
                    <a href="${postLink}" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
                </div>
            </article>
            `;
        }).join('');

    } catch (error) {
        console.error('Error loading blog list:', error);
        document.getElementById('blog-list').innerHTML = '<p>Error loading posts. Please try again later.</p>';
    }
}

async function loadBlogPost() {
    try {
        // Extract slug from URL: /blog/slug.html -> slug OR /blog/post.html?slug=slug
        const urlParams = new URLSearchParams(window.location.search);
        let slug = urlParams.get('slug');

        if (!slug) {
            const path = window.location.pathname;
            slug = path.split('/').pop().replace('.html', '');
        }

        if (!slug || slug === 'post') {
            // Handle case where we might be on /blog/post.html directly without a rewrite or query param
            // For now, let's assume the rewrite works and we get the slug from the URL if it was /blog/welcome.html
            // BUT, if Netlify rewrites /blog/welcome.html to /blog/post.html, the browser URL stays /blog/welcome.html
            // So extracting from location.pathname is correct.
            console.log('Current slug:', slug);
        }

        const response = await fetch(`/posts/${slug}.md`);
        if (!response.ok) throw new Error('Post not found');

        const text = await response.text();

        // Parse Frontmatter (simple regex)
        const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
        const match = text.match(frontmatterRegex);

        let content = text;
        let metadata = {};

        if (match) {
            content = text.replace(match[0], '');
            const frontmatter = match[1];
            frontmatter.split('\n').forEach(line => {
                const [key, ...value] = line.split(':');
                if (key && value) {
                    let val = value.join(':').trim();
                    // Remove quotes if present
                    if (val.startsWith('"') && val.endsWith('"')) {
                        val = val.slice(1, -1);
                    }
                    // Handle arrays (simple comma separated)
                    if (val.startsWith('[') && val.endsWith(']')) {
                        val = val.slice(1, -1).split(',').map(s => s.trim().replace(/"/g, ''));
                    }
                    metadata[key.trim()] = val;
                }
            });
        }

        // Update Page Title
        if (metadata.title) {
            document.title = `${metadata.title} | Aron's Space`;
            document.getElementById('post-title').textContent = metadata.title;
        }

        // Update Meta
        if (metadata.date) {
            document.getElementById('post-date').textContent = formatDate(metadata.date);
        }

        if (metadata.cover) {
            const coverImg = document.getElementById('post-cover');
            coverImg.src = metadata.cover;
            coverImg.style.display = 'block';
        }

        // Render Markdown
        document.getElementById('post-content').innerHTML = marked.parse(content);

    } catch (error) {
        console.error('Error loading blog post:', error);
        document.getElementById('blog-post').innerHTML = '<div class="container"><p>Post not found.</p><a href="/blog/index.html" class="btn btn-primary">Back to Blog</a></div>';
    }
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}
