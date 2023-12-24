document.addEventListener("DOMContentLoaded", function () {
    // Data post
    let posts = [
        { id: 1, title: "Post 1", imageUrl: "https://riseuplabs.com/wp-content/uploads/2022/05/social-media-app-development-article-inner-thumbnail.jpg", date: "2023-01-01" },
        { id: 2, title: "Post 2", imageUrl: "https://static.bhphotovideo.com/explora/sites/default/files/Gift-Guide-for-Content-Creators-ts.jpg", date: "2023-02-01" },
        { id: 3, title: "Post 3", imageUrl: "https://riseuplabs.com/wp-content/uploads/2022/05/social-media-app-development-article-inner-thumbnail.jpg", date: "2023-03-01" },
        { id: 4, title: "Post 4", imageUrl: "https://static.bhphotovideo.com/explora/sites/default/files/Gift-Guide-for-Content-Creators-ts.jpg", date: "2023-04-01" },
        { id: 5, title: "Post 5", imageUrl: "https://riseuplabs.com/wp-content/uploads/2022/05/social-media-app-development-article-inner-thumbnail.jpg", date: "2023-05-01" },
        { id: 6, title: "Post 6", imageUrl: "https://static.bhphotovideo.com/explora/sites/default/files/Gift-Guide-for-Content-Creators-ts.jpg", date: "2023-06-01" },
        { id: 7, title: "Post 7", imageUrl: "https://riseuplabs.com/wp-content/uploads/2022/05/social-media-app-development-article-inner-thumbnail.jpg", date: "2023-01-01" },
        { id: 8, title: "Post 8", imageUrl: "https://static.bhphotovideo.com/explora/sites/default/files/Gift-Guide-for-Content-Creators-ts.jpg", date: "2023-02-01" },
        { id: 9, title: "Post 9", imageUrl: "https://riseuplabs.com/wp-content/uploads/2022/05/social-media-app-development-article-inner-thumbnail.jpg", date: "2023-03-01" },
        { id: 10, title: "Post 10", imageUrl: "https://static.bhphotovideo.com/explora/sites/default/files/Gift-Guide-for-Content-Creators-ts.jpg", date: "2023-04-01" },
        { id: 11, title: "Post 11", imageUrl: "https://riseuplabs.com/wp-content/uploads/2022/05/social-media-app-development-article-inner-thumbnail.jpg", date: "2023-05-01" },
        { id: 12, title: "Post 12", imageUrl: "https://static.bhphotovideo.com/explora/sites/default/files/Gift-Guide-for-Content-Creators-ts.jpg", date: "2023-06-01" },
        { id: 13, title: "Post 13", imageUrl: "https://riseuplabs.com/wp-content/uploads/2022/05/social-media-app-development-article-inner-thumbnail.jpg", date: "2023-05-01" },
        { id: 14, title: "Post 14", imageUrl: "https://static.bhphotovideo.com/explora/sites/default/files/Gift-Guide-for-Content-Creators-ts.jpg", date: "2023-06-01" },
        // ... (data post lainnya)
    ];

    // Fungsi untuk menampilkan nomor halaman
    function renderPageNumbers(totalPages) {
        const pageNumbersContainer = document.getElementById("page-numbers");
        pageNumbersContainer.innerHTML = "";

        for (let i = 1; i <= totalPages; i++) {
            const pageNumber = document.createElement("button");
            pageNumber.textContent = i;
            pageNumber.classList.add("pagination-btn");
            pageNumber.addEventListener("click", function () {
                currentPage = i;
                handlePageChange();
            });

            if (i === currentPage) {
                pageNumber.classList.add("active");
            }

            pageNumbersContainer.appendChild(pageNumber);
        }
    }

    const sortSelect = document.getElementById("sort-select");
    const showPerPageSelect = document.getElementById("show-per-page");
    const postsSection = document.getElementById("posts-section");
    const header = document.getElementById("site-header");
    const storedPage = parseInt(localStorage.getItem("currentPage")) || 1;
    const storedPostsPerPage = parseInt(localStorage.getItem("postsPerPage")) || 10;
    const storedSort = localStorage.getItem("selectedSort") || "latest";

    let currentPage = parseInt(localStorage.getItem("currentPage")) || 1;
    let postsPerPage = parseInt(localStorage.getItem("postsPerPage")) || 10;
    let selectedSort = localStorage.getItem("selectedSort") || "latest";

    var banner = document.querySelector('.banner');
    var bannerContent = document.querySelector('.banner-content');

    currentPage = storedPage;
    postsPerPage = storedPostsPerPage;
    selectedSort = storedSort;

    // Render posts
    function renderPosts(postsToShow) {
        postsSection.innerHTML = "";
        postsToShow.forEach(post => {
            const postCard = document.createElement("div");
            postCard.classList.add("post");

            const thumbnailContainer = document.createElement("div");
            thumbnailContainer.classList.add("thumbnail-container");

            const thumbnail = document.createElement("img");
            thumbnail.src = post.imageUrl;
            thumbnail.alt = post.title + " Thumbnail";
            thumbnail.loading = "lazy";

            const title = document.createElement("h3");
            title.textContent = post.title;

            const date = document.createElement("p");
            date.textContent = new Date(post.date).toDateString();

            thumbnailContainer.appendChild(thumbnail);
            postCard.appendChild(thumbnailContainer);
            postCard.appendChild(title);
            postCard.appendChild(date);

            postsSection.appendChild(postCard);
        });
    }

    // Function to sort posts
    function sortPosts(postsArray, sortOrder) {
        const sortedPosts = [...postsArray];
        if (sortOrder === "latest") {
            sortedPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (sortOrder === "oldest") {
            sortedPosts.sort((a, b) => new Date(a.date) - new Date(b.date));
        }
        return sortedPosts;
    }

    function calculateTotalPages() {
        const totalPosts = sortPosts(posts, selectedSort).length;
        return Math.ceil(totalPosts / postsPerPage);
    }

    function updateShowingInfo(totalPosts) {
        const startIndex = (currentPage - 1) * postsPerPage + 1;
        const endIndex = Math.min(startIndex + postsPerPage - 1, totalPosts);
        const showingInfo = `Showing ${startIndex} - ${endIndex} of ${totalPosts}`;
        document.querySelector('.showing-info').textContent = showingInfo;

        window.addEventListener('scroll', function () {
            var scrollPosition = window.scrollY;
            banner.style.backgroundPositionY = -scrollPosition * 0.5 + 'px';
            bannerContent.style.transform = 'translate(-50%, ' + scrollPosition * 0.2 + 'px)';
        });
    }

    async function fetchData() {
        const proxyUrl = "https://cors-anywhere.herokuapp.com";
        const apiUrl = "https://suitmedia-backend.suitdev.com/api/ideas";
        const params = {
            "page[number]": currentPage,
            "page[size]": postsPerPage,
            append: ['small_image', 'medium_image'],
            sort: '-published_at'
        };

        const queryString = Object.entries(params)
            .map(([key, value]) => `${key}=${value}`)
            .join('&');

        const urlWithParams = `${apiUrl}?${queryString}`;
        const urlThroughProxy = `${proxyUrl}/${urlWithParams}`;

        try {
            const response = await fetch(urlThroughProxy);
            const data = await response.json();
            posts = data.data;
            return posts;
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    function handlePageChange() {
        localStorage.setItem("currentPage", currentPage);
        localStorage.setItem("postsPerPage", postsPerPage);
        localStorage.setItem("selectedSort", selectedSort);

        const sortedPosts = sortPosts(posts, selectedSort);
        const startIndex = (currentPage - 1) * postsPerPage;
        const endIndex = startIndex + postsPerPage;

        const postsToShow = sortedPosts.slice(startIndex, endIndex);
        renderPosts(postsToShow);

        const totalPages = calculateTotalPages();
        renderPageNumbers(totalPages);
        updateShowingInfo(sortedPosts.length);
    }

    // Initial render
    fetchData().then(() => {
        handlePageChange();
    });

    // Event listeners
    sortSelect.addEventListener("change", function () {
        currentPage = 1;
        selectedSort = sortSelect.value;
        handlePageChange();
    });

    showPerPageSelect.addEventListener("change", function () {
        currentPage = 1;
        postsPerPage = parseInt(showPerPageSelect.value, 10);
        handlePageChange();
    });

    document.getElementById("prev-page").addEventListener("click", function () {
        if (currentPage > 1) {
            currentPage--;
            handlePageChange();
        }
    });

    document.getElementById("next-page").addEventListener("click", function () {
        const totalPosts = sortPosts(posts, selectedSort).length;
        const totalPages = Math.ceil(totalPosts / postsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            handlePageChange();
        }
    });

    var prevScrollpos = window.pageYOffset;

    window.onscroll = function () {
        var currentScrollPos = window.pageYOffset;

        if (prevScrollpos > currentScrollPos) {
            header.style.top = "0";
            header.classList.remove("scrolled");
        } else {
            header.style.top = "-" + header.clientHeight + "px";
            header.classList.add("scrolled");
        }
        prevScrollpos = currentScrollPos;
    };
});
