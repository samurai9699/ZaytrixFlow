import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowLeft, Tag } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { getPostBySlug } from '../../data/blogPosts';

function renderMarkdown(content: string): React.ReactNode {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={i} className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4">
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith('### ')) {
      elements.push(
        <h3 key={i} className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-3">
          {line.slice(4)}
        </h3>
      );
    } else if (line.startsWith('> ')) {
      const blockquoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith('> ')) {
        blockquoteLines.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <blockquote
          key={i}
          className="border-l-4 border-primary-400 dark:border-primary-500 pl-6 py-4 my-6 bg-primary-50/50 dark:bg-primary-900/10 rounded-r-lg"
        >
          {blockquoteLines.map((ql, qi) => (
            <p key={qi} className="text-gray-700 dark:text-gray-300 italic leading-relaxed">
              {renderInlineFormatting(ql)}
            </p>
          ))}
        </blockquote>
      );
      continue;
    } else if (line.startsWith('- **')) {
      const listItems: React.ReactNode[] = [];
      while (i < lines.length && lines[i].startsWith('- ')) {
        const itemText = lines[i].slice(2);
        listItems.push(
          <li key={i} className="flex gap-3 mb-2">
            <span className="text-primary-500 mt-1.5 flex-shrink-0">-</span>
            <span className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {renderInlineFormatting(itemText)}
            </span>
          </li>
        );
        i++;
      }
      elements.push(
        <ul key={`list-${i}`} className="my-4 space-y-2 ml-0">
          {listItems}
        </ul>
      );
      continue;
    } else if (line.startsWith('- ')) {
      const listItems: React.ReactNode[] = [];
      while (i < lines.length && lines[i].startsWith('- ')) {
        listItems.push(
          <li key={i} className="flex gap-3 mb-2">
            <span className="text-primary-500 mt-1.5 flex-shrink-0">-</span>
            <span className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {renderInlineFormatting(lines[i].slice(2))}
            </span>
          </li>
        );
        i++;
      }
      elements.push(
        <ul key={`list-${i}`} className="my-4 space-y-2 ml-0">
          {listItems}
        </ul>
      );
      continue;
    } else if (line.match(/^\d+\. /)) {
      const listItems: React.ReactNode[] = [];
      while (i < lines.length && lines[i].match(/^\d+\. /)) {
        const text = lines[i].replace(/^\d+\. /, '');
        listItems.push(
          <li key={i} className="flex gap-3 mb-2">
            <span className="text-primary-500 font-semibold mt-0.5 flex-shrink-0">
              {lines[i].match(/^(\d+)\./)?.[1]}.
            </span>
            <span className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {renderInlineFormatting(text)}
            </span>
          </li>
        );
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="my-4 space-y-2 ml-0 list-none">
          {listItems}
        </ol>
      );
      continue;
    } else if (line.trim() === '') {
      elements.push(<div key={i} className="h-2" />);
    } else {
      elements.push(
        <p key={i} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          {renderInlineFormatting(line)}
        </p>
      );
    }
    i++;
  }

  return elements;
}

function renderInlineFormatting(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[2]) {
      parts.push(<strong key={match.index} className="font-semibold text-gray-900 dark:text-white">{match[2]}</strong>);
    } else if (match[3]) {
      parts.push(<em key={match.index} className="italic">{match[3]}</em>);
    } else if (match[4]) {
      parts.push(
        <code key={match.index} className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono text-primary-600 dark:text-primary-400">
          {match[4]}
        </code>
      );
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Navbar />
        <main className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Post not found</h1>
          <Link to="/blog" className="text-primary-600 dark:text-primary-400 hover:underline">
            Back to blog
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mb-8 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to all posts
          </Link>

          <article>
            <header className="mb-10">
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                  >
                    <Tag size={12} />
                    {tag}
                  </span>
                ))}
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-gray-900 dark:text-white leading-tight mb-6">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>{post.readTime}</span>
                </div>
              </div>

              <div className="h-px bg-gradient-to-r from-primary-200 to-secondary-200 dark:from-primary-800 dark:to-secondary-800 mt-8" />
            </header>

            <div className="prose-custom">
              {renderMarkdown(post.content)}
            </div>

            <div className="h-px bg-gradient-to-r from-primary-200 to-secondary-200 dark:from-primary-800 dark:to-secondary-800 mt-12 mb-10" />

            <div className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-2xl p-8 text-center border border-primary-200/50 dark:border-primary-700/50">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Put these insights into practice
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                ZaytrixFlow automates invoice reminders, tracks payments, and gives you a real-time view of your cash flow. Start getting paid faster.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
              >
                Get started free
              </Link>
            </div>
          </article>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPostPage;
