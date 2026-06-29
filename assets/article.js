(() => {
	if (document.querySelector(".article-template") !== null) {
		const setArticleTemplate = () => {
			document.querySelectorAll(".article-template").forEach((article) => {
				let breadcrumbsBlock = document.getElementById("breadcrumbs");
				let isStandardArticle = article.classList.contains(
					"article-template__standard"
				);
				let isNoImage = article.querySelector(".no-image") !== null;

				breadcrumbsBlock.classList.add(
					isStandardArticle ? "standard" : "overlay"
				);

				if (isNoImage) {
					article?.classList.add("no-image");
					breadcrumbsBlock.classList.add("no-image");
				}
			});
		};

		document.addEventListener("shopify:section:load", setArticleTemplate);
		document.addEventListener("shopify:section:select", setArticleTemplate);

		setArticleTemplate();
	}
})();
