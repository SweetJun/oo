// 计费模块api

const api = process.env.VUE_APP_API

export default {
  oil_lines: api + '/oil_lines', // 油价管理列表
  oil_line: api + '/oil_line', // 添加编辑油价
  oil_line_delete: api + '/oil_line/delete', // 油价删除
  region_search: api + '/region/search/by/name',

  mileages: api + '/mileages', // 内部里程列表
  mileage: api + '/mileage', // 添加编辑
  mileage_delete: api + '/mileage/delete', //内部里程删除/批量删除
  carry_type: api + '/carry_type', // 行驶类型

  clientRuleSet: api + '/client_rule_set', // 客户规则汇总表
  clientRule: api + '/client_rule', // 客户规则价格列表
  clientMissRule: api + '/client_miss_rule', // 客户规则缺失价格列表
  clientRuleBatchDelete: api + '/client_rule_batch_delete', // 客户规则批量删除规则

  providerRuleSet: api + '/provider_rule_set', // 承运方规则汇总表
  providerRule: api + '/provider_rule', // 承运方规则价格列表
  providerMissRule: api + '/provider_miss_rule', // 承运方规则缺失价格列表
  providerRuleBatchDelete: api + '/provider_rule_batch_delete', // 承运方规则批量删除规则

  expense: api + '/expense', // 获取费用项
  getAvailableExpense: api + '/get_available_expense', // 获取可用的费用项
  expenseRules: api + '/expense_rules', // 计费策略列表
  expenseRule: api + '/expense_rule', // 创建、详情、编辑、删除计费策略
  expenseRuleSupport: api + '/expense_rule/support', // 基础数据支持
  expenseRuleMatching: api + '/expense_rule/matching' // 计费策略匹配
}
