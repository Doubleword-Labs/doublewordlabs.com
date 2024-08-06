import { NotionAPI } from "notion-client";
import {
  getCanonicalPageId,
  getPageProperty,
  getBlockTitle,
  getBlockIcon,
  isUrl,
} from "notion-utils";
import type { PageBlock, Block } from "notion-types";
import { defaultMapImageUrl } from "react-notion-x";
import { pipe, prop, isEmpty } from "ramda";
import { allPass } from "ramda";

// import { defaultPageCover, defaultPageIcon } from './config'

export const mapImageUrl = (url: string, block: Block) => {
  // if (url === defaultPageCover || url === defaultPageIcon) {
  //   return url
  // }

  return defaultMapImageUrl(url, block);
};

function getCompatibleImageUrl(
  url: string | null,
  fallbackUrl?: string,
): string | null {
  const image = url;

  if (image) {
    const imageUrl = new URL(image);

    if (imageUrl.host === "images.unsplash.com") {
      if (!imageUrl.searchParams.has("w")) {
        imageUrl.searchParams.set("w", "1200");
        imageUrl.searchParams.set("fit", "max");
        return imageUrl.toString();
      }
    }
  }

  return image;
}

const notion = new NotionAPI();

const BLOG_POSTS_ROOT_PAGE_ID = "c9ebbf93c0b74de785068243fa8813ca";

function isPage(block: Block): block is PageBlock {
  return block.type === "page";
}

export async function getPosts(rootPageId: string) {
  const page = await notion.getPage(rootPageId, { fetchCollections: true });

  const filters = [isPage];

  const pageIds = Object.values(page.block)
    .slice(2)
    .filter(pipe(prop("value"), allPass(filters)))
    .map((block) => block.value.id);

  const posts = await Promise.all(
    pageIds.map(async (pageId) => ({
      pageId,
      recordMap: await notion.getPage(pageId),
    })),
  );

  return posts.map(({ pageId, recordMap }) => {
    const block = Object.values(recordMap.block)[0].value;

    const isBlogPost =
      block.type === "page" && block.parent_table === "collection";
    const title = getBlockTitle(block, recordMap);

    const imageCoverPosition = (block as PageBlock).format?.page_cover_position;

    const imageObjectPosition = imageCoverPosition
      ? `center ${(1 - imageCoverPosition) * 100}%`
      : null;

    const imageBlockUrl = mapImageUrl(
      getPageProperty<string>("Social Image", block, recordMap) ||
        (block as PageBlock).format?.page_cover!,
      block,
    );

    const blockIcon = getBlockIcon(block, recordMap);

    const authorImageBlockUrl = mapImageUrl(
      (blockIcon && isUrl(blockIcon) ? blockIcon : null) as string,
      block,
    );
    const [authorImage, image] = [
      getCompatibleImageUrl(authorImageBlockUrl, undefined),
      getCompatibleImageUrl(imageBlockUrl, undefined),
    ];

    let author = getPageProperty<string>("Author", block, recordMap);

    if (isEmpty(author)) {
      author = import.meta.env.PUBLIC_DEFAULT_AUTHOR_NAME;
    }

    const socialDescription = getPageProperty<string>(
      "Description",
      block,
      recordMap,
    );

    const lastUpdatedTime = getPageProperty<number>(
      "Last Updated",
      block,
      recordMap,
    );

    const publishedTime = getPageProperty<number>(
      "Published",
      block,
      recordMap,
    );

    const datePublished = publishedTime ? new Date(publishedTime) : undefined;

    const date =
      isBlogPost && datePublished
        ? `${datePublished.toLocaleString("en-US", {
            month: "long",
          })} ${datePublished.getFullYear()}`
        : undefined;

    const detail = date || author;

    const visibility = getPageProperty<boolean>("Public", block, recordMap)
      ? "public"
      : "private";

    const pageInfo = {
      pageId,
      title,
      image,
      imageObjectPosition,
      author,
      authorImage,
      detail,
      datePublished,
      visibility,
      lastUpdated: lastUpdatedTime ? new Date(lastUpdatedTime) : undefined,
    };

    const blockSlug = getPageProperty<string>("Slug", block, recordMap);

    const slug = !isEmpty(blockSlug)
      ? blockSlug
      : getCanonicalPageId(pageId, recordMap, {
          uuid: false,
        })!;

    return {
      pageId,
      slug,
      href: `/blog/${slug}`,
      title: pageInfo.title,
      date: datePublished,
      author: {
        name: author,
      },
      description: socialDescription,
      data: recordMap,
      pageInfo,
    };
  });
}

export function getBlogPosts() {
  return getPosts(BLOG_POSTS_ROOT_PAGE_ID);
}
