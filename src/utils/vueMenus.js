const menus = {
  home: {
    name: '首页',
    icon: 'iconxshouye',
    path: '/home'
  },
  business: {
    name: '业务',
    icon: 'iconxyewu',
    children: {
      order: {
        name: '运单列表',
        path: '/order'
      },
      dispatch: {
        name: '调度单列表',
        path: '/dispatch'
      },
      dispatch_to_load_vehicle: {
        name: '待装车列表',
        path: '/dispatchToLoadVehicle'
      },
      dispatch_on_the_way: {
        name: '在途列表',
        path: '/dispatchOnTheWay'
      },
      dispatch_to_delivery_vehicle: {
        name: '待交货列表',
        path: '/dispatchToDeliveryVehicle'
      },
      order_to_reply: {
        name: '待回单列表',
        path: '/orderToReply'
      }
    }
  },
  finance: {
    name: '财务',
    icon: 'iconxcaiwu',
    children: {
      dispatch_borrowing: {
        name: '借支单列表',
        path: '/borrowing'
      },
      dispatch_supplement: {
        name: '补款单列表',
        path: '/supplement'
      },
      bankcard_pay_records: {
        name: '银行卡打款列表',
        path: '/bankremittance'
      },
      oil_card_pay_records: {
        name: '油卡打款列表',
        path: '/oilremittance'
      },
      wjy_pay_records: {
        name: '万金油打款列表',
        path: '/wjyremittance'
      },
      default_pay_records: {
        name: '其他打款列表',
        path: '/defaultremittance'
      }
    }
  },
  settlement: {
    name: '结算',
    icon: 'iconxjiesuan',
    children: {
      dispatch_to_add_settlement_bill: {
        name: '待结算调度单',
        path: '/settlement/dispatchtoaddsettlementbill'
      },
      dispatch_own_settlement: {
        name: '自有驾驶员结算',
        path: '/settlement/owndriver'
      },
      dispatch_personal_settlement: {
        name: '个人外协结算',
        path: '/settlement/personaltruck'
      },
      owing_entity: {
        name: '欠款管理',
        path: '/settlement/owingEntity'
      },
      provider_bill: {
        name: '承运方账单',
        path: '/settlement/carrierbill'
      }
    }
  },
  report: {
    name: '报表中心',
    icon: 'iconxbaobiao',
    children: {
      report_dashboard: {
        name: '数据仪表盘',
        children: {
          client_income: {
            name: '客户产值报表',
            path: '/clientIncome'
          },
          transport_amount: {
            name: '发运量看板',
            path: '/transportAmount'
          }
        }
      },
      own_truck_cost_chart: {
        name: '自有车成本报表',
        path: '/owntruck/costchart'
      },
      custom_chart_management: {
        name: '配置报表',
        path: '/custom/chartmanagement'
      },
      custom_chart_view: {
        name: '我的报表',
        path: '/custom/chart'
      }
    }
  },
  expense_management: {
    name: '计费',
    icon: 'iconxjifei',
    children: {
      client_rule_set: {
        name: '客户结算规则管理',
        path: '/clientrule'
      },
      provider_rule_set: {
        name: '承运方结算规则管理',
        path: '/providerule'
      },
      expense_rule: {
        name: '计费策略管理',
        path: '/expenserule'
      },
      oil_line: {
        name: '公司油价管理',
        path: '/oilPrice'
      },
      mileage: {
        name: '内部里程管理',
        path: '/mileages'
      }
    }
  },
  resource: {
    name: '资源',
    icon: 'iconxziyuan',
    children: {
      client: {
        name: '客户管理',
        path: '/client'
      },
      provider: {
        name: '承运方管理',
        path: '/provider'
      },
      settlement_account: {
        name: '结算人管理',
        path: '/settlementaccount'
      },
      oil_card: {
        name: '加油卡管理',
        path: '/oilCard'
      },
      truck: {
        name: '运力管理',
        children: {
          own_truck: {
            name: '自有运力',
            path: '/truck/ownTruck'
          },
          contract_truck: {
            name: '合同外协运力',
            path: '/truck/contractTruck'
          },
          personal_truck: {
            name: '个人外协运力',
            path: '/truck/personalTruck'
          },
          truck_oil_cost: {
            name: '运力油耗设置',
            path: '/truck/oilcost'
          },
          truck_group: {
            name: '运力分组设置',
            path: '/truck/truckgroup'
          }
        }
      },
      tractor_trailer: {
        name: '车辆管理',
        children: {
          tractor_list: {
            name: '车辆列表',
            path: '/tractor'
          },
          trailer_list: {
            name: '挂车列表',
            path: '/trailer'
          }
        }
      },
      driver: {
        name: '驾驶员管理',
        children: {
          own_driver: {
            name: '自有驾驶员',
            path: '/driver/ownDriver'
          },
          driver_group: {
            name: '驾驶员分组设置',
            path: '/driver/driverGrouping'
          }
        }
      },
      vehicle_warehouse: {
        name: '商品车仓库管理',
        path: '/vehicleWarehouse'
      }
    }
  },
  base_information: {
    name: '基础信息管理',
    icon: 'iconjichuxinxiguanli',
    children: {
      region: {
        name: '地区管理',
        path: '/areamanagement'
      },
      expense: {
        name: '费用类目管理',
        path: '/costTypeManagement'
      },
      dealer: {
        name: '经销商管理',
        path: '/dealerManagement'
      },
      vehicle: {
        name: '商品车管理',
        path: '/goodsCar'
      },
      vehicle_brand: {
        name: '商品车品牌管理',
        path: '/goodsCar/brand'
      },
      vehicle_code: {
        name: '车型代码管理',
        path: '/goodsCar/vehicleCode'
      }
    }
  },
  system_config: {
    name: '系统设置',
    icon: 'iconxshezhi',
    children: {
      transport_type: {
        name: '承运类型管理',
        path: '/transporttype'
      },
      role: {
        name: '角色管理',
        path: '/role'
      },
      user_manager: {
        name: '账号管理',
        path: '/usermanager'
      },
      department: {
        name: '组织架构',
        path: '/department'
      },
      system_setting: {
        name: '系统设置',
        path: '/systemsetup'
      },
      third_party_services: {
        name: '第三方服务管理',
        path: '/authorise'
      }
    }
  }
}
export default menus
