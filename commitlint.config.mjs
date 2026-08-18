export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // 'scope-enum': [2, 'always', ['your_scope', 'your_scope']],
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'chore',
        'style',
        'refactor',
        'ci',
        'test',
        'revert',
        'perf',
        'vercel',
      ],
    ],
  },
}
