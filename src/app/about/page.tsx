import Image from "next/image";
import { Metadata } from "next";
import { Github, Mail, MapPin, X, Link as LinkIcon, Code2, User, Laptop, Monitor, Keyboard, Smartphone, Headphones, Watch, AppWindow, FileText, PenTool, Globe, MessageSquare, Zap } from "lucide-react";

export const metadata: Metadata = {
    title: "About Me",
    description: "Learn more about Wiley Zhang, an AI/LLM developer.",
};

export default function AboutPage() {
    return (
        <div className="py-12">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    {/* Sidebar - Sticky on Desktop */}
                    <aside className="lg:col-span-1">
                        <div className="lg:sticky lg:top-24 space-y-8">
                            {/* Profile Card */}
                            <div className="text-center lg:text-left">
                                <div className="relative w-48 h-48 mx-auto lg:mx-0 mb-6 rounded-full">
                                    <Image
                                        src="/avatar.png"
                                        alt="Wiley Zhang"
                                        fill
                                        className="object-contain drop-shadow-2xl"
                                        priority
                                    />
                                </div>
                                <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
                                    Wiley Zhang
                                </h1>
                                <p className="text-lg text-gray-600 dark:text-gray-400 font-medium mb-4">
                                    AI/LLM Developer
                                </p>

                                <div className="flex flex-col gap-2 text-sm text-gray-500 dark:text-gray-400">
                                    <div className="flex items-center justify-center lg:justify-start gap-2">
                                        <MapPin className="w-4 h-4" />
                                        <span>Xi'an, China</span>
                                    </div>
                                    <div className="flex items-center justify-center lg:justify-start gap-2">
                                        <LinkIcon className="w-4 h-4" />
                                        <a href="https://wileyzhang.com" className="hover:text-green-500 transition-colors">wileyzhang.com</a>
                                    </div>
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className="flex flex-col gap-3">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">
                                    Connect
                                </h3>
                                <a href="https://github.com/bluechanel" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group">
                                    <div className="p-2 bg-white dark:bg-gray-900 rounded-md shadow-sm group-hover:scale-110 transition-transform">
                                        <Github className="w-4 h-4 text-gray-900 dark:text-white" />
                                    </div>
                                    <span className="text-sm font-medium">GitHub</span>
                                </a>
                                <a href="mailto:bluechanel612@gmail.com" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group">
                                    <div className="p-2 bg-white dark:bg-gray-900 rounded-md shadow-sm group-hover:scale-110 transition-transform">
                                        <Mail className="w-4 h-4 text-red-500" />
                                    </div>
                                    <span className="text-sm font-medium">Email</span>
                                </a>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="lg:col-span-3 space-y-12">
                        {/* Bio Section */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                    <User className="w-6 h-6 text-green-600 dark:text-green-400" />
                                </div>
                                <h2 className="text-2xl font-bold">关于我</h2>
                            </div>
                            <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed">
                                <p>
                                    Hi，我是 Wiley。一名对<strong>人工智能</strong>和<strong>大型语言模型</strong>怀抱热情的开发者。
                                </p>
                                <p>
                                    我坚信<em>“AI 之初，性本善”</em>，AI 有能力改变世界。
                                </p>
                                <p>
                                    目前，我专注于构建智能 Agent，并深入探索最新 LLM 的潜力。我坚信知识分享是推动技术进步的关键。
                                </p>
                                <p>
                                    工作之余，我喜欢看电影、阅读博客、以及第九艺术，或者在草地上晒太阳，偶尔发现美。
                                </p>
                            </div>
                        </section>

                        {/* My Gear Section */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                                    <Laptop className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                                </div>
                                <h2 className="text-2xl font-bold">我的设备</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                        <Monitor className="w-5 h-5 text-gray-500" />
                                        工作
                                    </h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-3 p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800">
                                            <div className="mt-1">
                                                <Laptop className="w-4 h-4 text-gray-400" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">MacBook Pro 14"</p>
                                                <p className="text-xs text-gray-500">M3 Pro, 32GB RAM</p>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3 p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800">
                                            <div className="mt-1">
                                                <Monitor className="w-4 h-4 text-gray-400" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">Dell U2723QE</p>
                                                <p className="text-xs text-gray-500">4K 27" Monitor</p>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3 p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800">
                                            <div className="mt-1">
                                                <Keyboard className="w-4 h-4 text-gray-400" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">HHKB Professional Hybrid</p>
                                                <p className="text-xs text-gray-500">Type-S, 白色</p>
                                            </div>
                                        </li>
                                    </ul>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                        <Smartphone className="w-5 h-5 text-gray-500" />
                                        生活
                                    </h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-3 p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800">
                                            <div className="mt-1">
                                                <Smartphone className="w-4 h-4 text-gray-400" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">iPhone 14，OPPO K3</p>
                                                <p className="text-xs text-gray-500">主力，备用</p>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3 p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800">
                                            <div className="mt-1">
                                                <Headphones className="w-4 h-4 text-gray-400" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">CMF by NOTHING</p>
                                                <p className="text-xs text-gray-500">日常</p>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3 p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800">
                                            <div className="mt-1">
                                                <Watch className="w-4 h-4 text-gray-400" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">Apple Watch Series 8</p>
                                                <p className="text-xs text-gray-500">日常</p>
                                            </div>
                                        </li>
                                    </ul>
                                </div>

                                <div className="space-y-4 md:col-span-2">
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                        <AppWindow className="w-5 h-5 text-gray-500" />
                                        App
                                    </h3>
                                    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                        <li className="flex items-start gap-3 p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800">
                                            <div className="mt-1">
                                                <FileText className="w-4 h-4 text-gray-400" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">Notion</p>
                                                <p className="text-xs text-gray-500">笔记与文档</p>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3 p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800">
                                            <div className="mt-1">
                                                <PenTool className="w-4 h-4 text-gray-400" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">Figma</p>
                                                <p className="text-xs text-gray-500">设计</p>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3 p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800">
                                            <div className="mt-1">
                                                <Globe className="w-4 h-4 text-gray-400" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">Arc</p>
                                                <p className="text-xs text-gray-500">浏览器</p>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3 p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800">
                                            <div className="mt-1">
                                                <MessageSquare className="w-4 h-4 text-gray-400" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">Feishu</p>
                                                <p className="text-xs text-gray-500">协作</p>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3 p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800">
                                            <div className="mt-1">
                                                <Code2 className="w-4 h-4 text-gray-400" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">Zed</p>
                                                <p className="text-xs text-gray-500">编辑器</p>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3 p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800">
                                            <div className="mt-1">
                                                <Zap className="w-4 h-4 text-gray-400" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">Folo</p>
                                                <p className="text-xs text-gray-500">效率</p>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Tech Stack Section */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                    <Code2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                </div>
                                <h2 className="text-2xl font-bold">技术栈</h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="bg-white dark:bg-gray-900 p-5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                                    <h3 className="font-semibold mb-4 text-gray-900 dark:text-gray-100">编程语言</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {["TypeScript", "Python", "Rust", "SQL"].map(item => (
                                            <span key={item} className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full">
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-gray-900 p-5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                                    <h3 className="font-semibold mb-4 text-gray-900 dark:text-gray-100">框架</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {["Next.js", "React", "FastAPI", "LangChain"].map(item => (
                                            <span key={item} className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full">
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-gray-900 p-5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                                    <h3 className="font-semibold mb-4 text-gray-900 dark:text-gray-100">工具</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {["Docker", "Git", "PostgreSQL", "Redis"].map(item => (
                                            <span key={item} className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full">
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-gray-900 p-5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                                    <h3 className="font-semibold mb-4 text-gray-900 dark:text-gray-100">AI / LLM</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {["OpenAI API", "Claude Code", "RAG", "Agents", "MCP"].map(item => (
                                            <span key={item} className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full">
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>
                    </main>
                </div>
            </div>
        </div>
    );
}
