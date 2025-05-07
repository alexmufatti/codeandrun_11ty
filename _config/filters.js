import { DateTime } from "luxon";

export default function(eleventyConfig) {
	eleventyConfig.addFilter("readableDate", (dateObj, format, zone) => {
		// Formatting tokens for Luxon: https://moment.github.io/luxon/#/formatting?id=table-of-tokens
		return DateTime.fromJSDate(dateObj, { zone: zone || "utc" }).toFormat(format || "dd LLLL yyyy");
	});

	eleventyConfig.addFilter("htmlDateString", (dateObj) => {
		// dateObj input: https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
		return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat('yyyy-LL-dd');
	});

	// Get the first `n` elements of a collection.
	eleventyConfig.addFilter("head", (array, n) => {
		if(!Array.isArray(array) || array.length === 0) {
			return [];
		}
		if( n < 0 ) {
			return array.slice(n);
		}

		return array.slice(0, n);
	});

	// Return the smallest number argument
	eleventyConfig.addFilter("min", (...numbers) => {
		return Math.min.apply(null, numbers);
	});

	// Return the keys used in an object
	eleventyConfig.addFilter("getKeys", target => {
		return Object.keys(target);
	});

	eleventyConfig.addFilter("filterTagList", function filterTagList(tags) {
		return (tags || []).filter(tag => ["all", "posts"].indexOf(tag) === -1);
	});

	eleventyConfig.addFilter("sortAlphabetically", strings =>
		(strings || []).sort((b, a) => b.localeCompare(a))
	);

	eleventyConfig.addFilter("concat", function (arr1, arr2) {
		return arr1.concat(arr2);
	});

	eleventyConfig.addFilter("excerpt", content => {
		if (!content) return "";
		const parts = content.split("<!--more-->");
		if (parts.length > 1) {
			return parts[0];
		}
		// Remove images, links and shortcodes from content
		let cleanContent = content
			.replace(/!\[.*?\]\(.*?\)/g, '') // Remove markdown images
			.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Replace markdown links with just the text
			.replace(/<img.*?>/g, '') // Remove HTML images
			.replace(/<a\b[^>]*>(.*?)<\/a>/g, '$1') // Replace HTML links with just the text
			.replace(/\{\%.*?\%\}/gs, '') // Remove shortcodes
			.replace(/\{\{.*?\}\}/gs, '') // Remove other template tags
			.replace(/\n\s*\n/g, '\n') // Remove multiple empty lines
			.trim();
		// If no <!--more--> tag, limit to 300 characters and add ellipsis
		const limitedContent = cleanContent.slice(0, 300).trim();
		return limitedContent + (cleanContent.length > 300 ? "..." : "");
	});
};
